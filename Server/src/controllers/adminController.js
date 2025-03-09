import { Course } from "../models/course.js";
import Lecture from "../models/Lecture.js";
import { User } from "../models/user.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary, deleteFromCloudinary} from "../utils/cloudinary.js";

const createCourse = asyncHandler(async (req,res)=>{
  const {title, description, category, createdBy, duration, price} = req.body;

  const imageLocalPath = req.files?.image[0]?.path;
  console.log(imageLocalPath);
  if(!imageLocalPath) {
    throw new ApiError(400,"Image is missing");
  }
  
  const image = await uploadOnCloudinary(imageLocalPath);
  if(!image) {
    throw new ApiError(400,"Image is missing");
  }

  const course = await Course.create({
    title,
    description,
    category,
    createdBy,
    image: image.url,
    duration,
    price,
  })

  return res.status(201).json(
    new ApiResponse(200, {}, "Course Added Successfully")
  )

})

const addLectures = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if(!course){
    throw new ApiError(404,"No course with this Id");
  }

  const {title, description} = req.body;

  const lectureLocalPath = req.files?.lecture?.[0]?.path;
  if(!lectureLocalPath) {
    throw new ApiError(400,"Video is missing");
  }
  
  const lecture = await uploadOnCloudinary(lectureLocalPath);
  if(!lecture) {
    throw new ApiError(400,"Video is missing");
  }

  const addedLecture = await Lecture.create({
    title,
    description,
    video: lecture?.url,
    course: course._id,
  })

  res.status(201).json(
    new ApiResponse(200,{addedLecture},`Lecture Added to ${course.title} successfully`)
  )

})

const deleteLecture = asyncHandler(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);
  
  const videoId = lecture.video.split('/').pop().split('.')[0];
  const type = lecture.video.split("/")[4];
  
  await deleteFromCloudinary(videoId,{resource_type:type});

  await Lecture.deleteOne(lecture);

  res.status(201).json(
    new ApiResponse(200,"Lecture Deleted Successfully")
  )
})

const deleteCourse = asyncHandler(async (req,res) => {

  
  const course = await Course.findById(req.params.id);
  console.log(course);
  const lectures = await Lecture.find({course: course._id});

  const imageId = course.image.split('/').pop().split('.')[0];
  const type = course.image.split("/")[4];
  await deleteFromCloudinary(imageId,{resource_type:type});

  lectures.forEach(async (lecture)=>{
    const videoId = lecture.video.split('/').pop().split('.')[0];
    const type = lecture.video.split("/")[4];
  
    await deleteFromCloudinary(videoId,{resource_type:type});
  })

  await Lecture.find({course:req.params.id}).deleteMany();

  await Course.deleteOne(course);

  await User.updateMany({},{$pull:{subscription: req.params.id}});

  res.status(201).json(
    new ApiResponse(200,"Course Deleted Successfully")
  )

})

const getStats = asyncHandler(async (req,res) => {
  const users = await User.find();
  const totalUsers = (await User.find()).length;
  const totalCourses = (await Course.find()).length;
  const totalLectures = (await Lecture.find()).length;

  res.status(201).json(
    new ApiResponse(200,{totalUsers,totalCourses,totalLectures},"Stats Fetched Successfully")
  )
})

const getUsers = asyncHandler(async(req,res) =>{
  const users = await User.find({_id: {$ne: req.user._id}}).select("-password -refreshToken");
  res.status(201).json( new ApiResponse(200,users))
})

const updateRole = asyncHandler(async(req,res) => {

  if(req.user.role !== "admin"){
    throw new ApiError(401,"Unauthorized");
  }

  const {role, id} = req.body;
  const user = await User.findById(id);

  user.role = role;
  await user.save();


  res.status(201).json(
    new ApiResponse(200,{},"User Role Updated Successfully")
  )

})

export {
  createCourse,
  addLectures,
  deleteLecture,
  deleteCourse,
  getStats,
  getUsers,
  updateRole
}