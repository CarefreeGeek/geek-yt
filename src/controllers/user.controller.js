import {asyncHandler} from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import {User} from "../models/user.models.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


    const {fullname, username, email, password, avatar } = req.body;
    console.log("email:", { email });

    if (
        [fullname, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError("All fields are required", 400);
    }

    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (existedUser) {
        throw new ApiError("User already exists", 409);
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError("Avatar is required", 400);
    }

    const avatarUrl = await uploadOnCloudinary(avatarLocalPath);
    const coverImageUrl = coverImageLocalPath 
    ? await uploadOnCloudinary(coverImageLocalPath)
    : null;

    // console.log("Avatar local path:", avatarLocalPath);
    // console.log("Cover image local path:", coverImageLocalPath);
    // console.log("Avatar URL:", avatarUrl);
    // console.log("Cover URL:", coverImageUrl);



    if (!avatarUrl) {
        throw new ApiError("Failed to upload avatar", 500);
    }


    const user = await User.create({
        fullname,
        email,
        username: username.toLowerCase(),
        password,
        avatar: avatarUrl.url || avatarUrl,
        coverImage: coverImageUrl.url || coverImageUrl,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError("Failed to create user", 500);
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User created successfully")
    );


});


export { registerUser };