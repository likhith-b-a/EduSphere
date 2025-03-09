import { Course } from "../models/course.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import Lecture from "../models/Lecture.js";
import { User } from "../models/user.js";
import { ApiError } from "../utils/ApiError.js";
import { deleteFromCloudinary } from "../utils/cloudinary.js";
import { instance } from "../index.js";
import { Payment } from "../models/payment.js";
import { createHmac } from "crypto"

const getAllCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({});

  res.status(200).json(
    new ApiResponse(200, courses)
  )
})

const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  res.status(200).json(
    new ApiResponse(200, course)
  )
})

const fetchLectures = asyncHandler(async (req, res) => {
  const lectures = await Lecture.find({ course: req.params.id });

  const user = await User.findById(req.user._id);

  if (user.role !== "admin" && !user.subscription.includes(req.params.id)) {
    throw new ApiError(400, "You have not subscribed to this course");
  }

  res.status(201).json(
    new ApiResponse(200, lectures)
  )

})

const fetchLecture = asyncHandler(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);

  console.log(lecture);

  const user = await User.findById(req.user._id);

  if (user.role !== "admin" && !user.subscription.includes(req.params.id)) {
    throw new ApiError(400, "You have not subscribed to this course");
  }

  res.status(201).json(
    new ApiResponse(200, lecture)
  )

})

const getMyCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ _id: req.user.subscription })

  res.status(201).json(
    new ApiResponse(200, courses)
  )
})


const checkout = asyncHandler(async (req, res) => {


  const user = await User.findById(req.user._id);

  const course = await Course.findById(req.params.id);

  // console.log(user);
  if (user.subscription?.includes(course._id)) {
    return ApiError(400, "You already have this course");
  }

  const options = {
    amount: Number(course.price * 100),
    currency: "INR",
  }

  const order = await instance.orders.create(options);

  console.log(order);

  res.status(201).json(
    new ApiResponse(200, { order, course })
  )

})

const paymentVerification = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature =
    createHmac("sha256", process.env.Razorpay_Secret)
      .update(body)
      .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    const user = await User.findById(req.user._id);

    const course = await Course.findById(req.params.id);

    user.subscription.push(course._id);

    await user.save();

    res.status(201).json(
      new ApiResponse(200, "Course Purchased Successfully")
    )
  } else {
    return new ApiError(400, "Payment Failed");
  }
})



export {
  getAllCourses,
  getCourse,
  fetchLectures,
  fetchLecture,
  getMyCourses,
  checkout,
  paymentVerification,
}


