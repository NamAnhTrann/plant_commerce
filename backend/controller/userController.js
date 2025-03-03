const User = require("../model/userModel.js");
const Location = require("../model/locationModel.js");

module.exports = {
  updateUser: async function (req, res) {
    const userId = req.user._id;

    const {
      userFirstName,
      userLastName,
      userPhoneNumber,
      locationStreet,
      locationCity,
      locationState,
      locationCountry,
      locationPostCode,
    } = req.body;

    try {
      const user = await User.findById(userId);
      let locationId = user.userLocation;

      if (locationId) {
        await Location.findByIdAndUpdate(locationId, {
          locationStreet,
          locationCity,
          locationState,
          locationCountry,
          locationPostCode,
        });
      } else {
        const newLocation = new Location({
          locationStreet,
          locationCity,
          locationState,
          locationCountry,
          locationPostCode,
        });
        await newLocation.save();
        locationId = newLocation._id;
      }

      const userUpdate = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            userFirstName,
            userLastName,
            userPhoneNumber,
            userLocation: locationId,
          },
        },
        { new: true }
      ).populate("userLocation");

      if (!userUpdate) {
        return res.status(404).json({ message: "User not found" });
      }

      return res
        .status(200)
        .json({ message: "User updated successfully", user: userUpdate });
    } catch (err) {
      return res.status(400).json({ message: "Error updating user", err });
    }
  },

  listUserId: async function (req, res) {
    const userId = req.user._id;
    try {
      const user = await User.findById(userId).populate("userLocation");
      return res.status(201).json(user);
    } catch (err) {
      return res.status(404).json(err);
    }
  },

  checkUserProfile: async function (req, res) {
    try {
      const userId = req.user._id;
      const user = await User.findById(userId);
      if (!user) {
        console.log("User not available");
        return res.status(400).json({ message: "user is not available" });
      }

      const isProfileComplete =
        user.userFirstName !== "none" &&
        user.userLastName !== "none" &&
        user.userPhoneNumber !== 0 &&
        user.userLocation !== null;

      return res.status(201).json({ isProfileComplete });
    } catch (err) {
      return res.status(404).json({ message: err });
    }
  },
};
