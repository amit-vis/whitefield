const Employee = require("../model/employee");
const cloudinary = require("../config/cloudinary");
const { validateRequiredFields, validateEmail, validateMobile } = require("../config/validator");

module.exports.create = async (req, res) => {
    try {

        const { name, email, mobile, designation, gender, course } = req.body;
        const file = req.files ? req.files.file : null;

        // Check for empty fields
        if (!validateRequiredFields([name, email, mobile, designation, gender]) || !course || course.length === 0 || !file) {
            console.error("Validation error: Missing fields");
            return res.status(400).json({
                message: "All fields are required!",
                success: false
            });
        }

        // Validate email
        if (!validateEmail(email)) {
            console.error("Validation error: Invalid email format");
            return res.status(401).json({
                message: "Email format is invalid!",
                success: false
            });
        }

        // Validate mobile number
        if (!validateMobile(mobile)) {
            console.error("Validation error: Incorrect mobile number");
            return res.status(402).json({
                message: "Mobile number is incorrect!",
                success: false
            });
        }

        // Check if employee already exists
        let employee = await Employee.findOne({ email: email });
        if (employee) {
            console.error("Duplicate error: Employee already exists");
            return res.status(404).json({
                message: "The employee already exists!",
                success: false
            });
        }

        // Split the course string into an array of courses
        const coursesArray = course.split(",").map(item => item.trim());

        const result = await cloudinary.uploader.upload(file.tempFilePath)
        // Create new employee
        employee = await Employee.create({
            name,
            email,
            mobile,
            designation,
            gender,
            course: coursesArray,  // Save as array of courses
            file: result.secure_url,
            admin: req.user._id
        });
        return res.status(200).json({
            message: "Employee registered successfully!",
            success: true,
            employee
        });
    } catch (error) {
        console.error("Internal server error:", error);
        return res.status(500).json({
            message: "Internal server error in registering the employee",
            success: false
        });
    }
};

module.exports.edit = async (req, res) => {
    try {
        const { name, email, mobile, designation, gender, course } = req.body;

        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(400).json({
                message: "Employee details do not exist or are not available!",
                success: false
            });
        }

        // Check if file is provided
        const file = req.files ? req.files.file : null;

        if (file) {
            cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
                if (err) {
                    return res.status(500).json({
                        message: "Cloudinary error",
                        success: false,
                        error: err.message
                    });
                }

                const coursesArray = course ? course.split(",").map(item => item.trim()) : employee.course;
                employee.name = name || employee.name;
                employee.email = email || employee.email;
                employee.mobile = mobile || employee.mobile;
                employee.designation = designation || employee.designation;
                employee.course = coursesArray || employee.course;
                employee.gender = gender || employee.gender;
                employee.file = result.secure_url || employee.file;

                await employee.save();
                return res.status(200).json({
                    message: "Employee details updated successfully!",
                    success: true,
                    employee
                });
            });
        } else {
            const coursesArray = course ? course.split(",").map(item => item.trim()) : employee.course;
            employee.name = name || employee.name;
            employee.email = email || employee.email;
            employee.mobile = mobile || employee.mobile;
            employee.designation = designation || employee.designation;
            employee.course = coursesArray || employee.course;
            employee.gender = gender || employee.gender;

            await employee.save();
            return res.status(200).json({
                message: "Employee details updated successfully!",
                success: true,
                employee
            });
        }
    } catch (error) {
        console.error("Error updating employee:", error);
        return res.status(500).json({
            message: "Server error!",
            success: false,
            error: error.message
        });
    }
};


module.exports.delete = async (req, res) => {
    try {
        const deleteEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (!deleteEmployee) {
            return res.status(400).json({
                message: "Employee details do not exist or are not available!",
                success: false
            });
        }
        return res.status(200).json({
            message: "Employee data deleted successfully!",
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error!",
            success: false
        });
    }
};

module.exports.getData = async (req, res) => {
    try {
        const { search, sortField = "createdAt", sortOrder = -1, page = 1 } = req.query;
        const limit = 5;
        const skip = (parseInt(page) - 1) * limit;

        const query = {};
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [
                { name: { $regex: searchRegex } },
                { email: { $regex: searchRegex } },
                { course: { $regex: searchRegex } },
                { designation: { $regex: searchRegex } }
            ];
        }

        // Sorting
        const sortOptions = {};
        if (["name", "email", "_id", "createdAt"].includes(sortField)) {
            sortOptions[sortField] = parseInt(sortOrder);
        } else {
            sortOptions["createdAt"] = -1; // Default sorting by creation date
        }

        const employees = await Employee.find(query)
            .skip(skip)
            .limit(limit)
            .sort(sortOptions);

        const totalEmployees = await Employee.countDocuments(query);

        return res.status(200).json({
            message: "Here are all the employee details!",
            employees,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalEmployees / limit)
        });
    } catch (error) {
        console.error("Internal server error:", error);
        return res.status(500).json({
            message: "Internal server error in getting the data!",
            success: false
        });
    }
};

module.exports.singleData = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        return res.json(employee)
    } catch (error) {
        return res.status(500).json({
            message: "Server error!",
            success: false
        });
    }
}