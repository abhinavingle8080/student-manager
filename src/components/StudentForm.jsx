// eslint-disable-next-line no-unused-vars
import React, {useState} from 'react'
import emailjs from '@emailjs/browser';
import '../styles/StudentForm.css';
import '../styles/CoursesDropDown.css';
import logo from '../img/Full-Logo.png';
import axios from "axios";


export default function StudentForm() {

    const [showCoupon, setShowCoupon] = useState(false);
    const [validCoupons, setValidCoupons] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [coursesDB, setCoursesDB] = useState([]);

    const [data, setData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        age: '',
        dob: '',
        gender: '',
        contact: '',
        parentContact: '',
        education: '',
        itLevel: '',
        courses: [],
        fees: 0,
        paidFees: 0,
        couponCode: '',
    });


    const handleChange = (event) => {
        const {name, value} = event.target;
        setData({...data, [name]: value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Send student data to the server
        const response = await fetch('https://sheetdb.io/api/v1/ivyccp59wbjb2?sheet=students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            console.log('Submission successful');

            sendEmail();
        } else {
            console.error('Submission failed');
        }
    };

    const sendEmail = () => {
        // Your Email.js configuration
        const emailService = 'service_7jnl14s';
        const emailTemplate = 'template_eh24x34';
        const publicKey = 'k1v0FLc-9rb5d4uuU';

        const templateParams = {
            from_name: 'Non Criterion Technology',
            to_email: data.email,
            to_name: data.firstName,
        }

        emailjs
            .send(emailService, emailTemplate, templateParams, publicKey)
            .then((response) => {
                console.log('Email sent successfully:', response);
            })
            .catch((error) => {
                console.error('Email sending failed:', error);
            });
    };


    const fetchCoupons = async () => {
        try {
            const responce = await axios.get('https://sheetdb.io/api/v1/ivyccp59wbjb2?sheet=coupons', {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (responce.status === 200) {
                const couponData = responce.data;
                if (Array.isArray(couponData)) {
                    setValidCoupons(couponData);
                }
            }
        } catch (e) {
            console.log('fetching coupons failed');
        }
    }


    const applyCoupon = () => {
        fetchCoupons();

        try {
            for (let i = 0; i < validCoupons.length; i++) {
                if (validCoupons[i].code === data.couponCode) {
                    console.log('coupon is valid');
                    data.paidFees -= validCoupons[i].amount;
                    setShowCoupon(false);
                }
            }
        } catch (e) {
            console.log('applying Coupon failed');
        }
    }

    const handleChangeCourses = (event) => {
        const {value, checked} = event.target;
        const updatedCourses = [...data.courses];
        if (checked) {
            if (!updatedCourses.includes(value)) {
                updatedCourses.push(value);
            }
        } else {
            const index = updatedCourses.indexOf(value);
            if (index !== -1) {
                updatedCourses.splice(index, 1);
            }
        }

        setData({
            ...data,
            courses: updatedCourses,
        });
    };

    const updateCourseFees = async () => {
        try {
            const responce = await axios.get('https://sheetdb.io/api/v1/ivyccp59wbjb2?sheet=courses', {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (responce.status === 200) {
                console.log('Courses fetched');
                const coursesData = responce.data;
                if (Array.isArray(coursesData)) {

                    let updatedPaidFees = 0;

                    // coursesData.forEach(()=>{
                    //     data.courses.forEach(()=>{
                    //         if (coursesData.courseName === data.courses) {
                    //             updatedPaidFees += Number(coursesData.coursePrice);
                    //         }
                    //     })
                    // })

                    for (let i = 0; i < coursesData.length; i++) {
                        for (let j = 0; j < data.courses.length; j++) {
                            if (coursesData[i].courseName === data.courses[j]) {
                                updatedPaidFees += Number(coursesData[i].coursePrice);
                            }
                        }
                    }
                    data.paidFees = updatedPaidFees;
                    setCoursesDB(coursesData);
                }
            }
        } catch (e) {
            console.log('Error fetching courses')
        }
    }

    return (
        <>
            <div className="container mt-5">
                <div className="student-form">
                    <img className={"logo"} src={logo}/>
                    <h2 className="form-heading">Registration Form</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="firstName">First Name:</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={data.firstName || ''}  //character limit
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Last Name:</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={data.lastName}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={data.email}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="age">Age:</label>
                            <input
                                type="number"
                                id="age"
                                name="age"
                                value={data.age}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="form-group dob">
                            <label htmlFor="dob">Date of Birth:</label>
                            <div className={"custom-date-input"}>
                                <input
                                    placeholder="Enter your Date of Birth"
                                    type="text"
                                    id="dob"
                                    name="dob"
                                    value={data.dob}
                                    className="form-control"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="gender">Gender:</label>
                            <select
                                id="gender"
                                name="gender"
                                value={data.gender}
                                onChange={handleChange}
                                className="form-control"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="contact">Contact:</label>
                            <input
                                type="tel"
                                id="contact"
                                name="contact"
                                value={data.contact}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="parentContact">Parent Contact:</label>
                            <input
                                type="tel"
                                id="parentContact"
                                name="parentContact"
                                value={data.parentContact}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="education">Education:</label>
                            <select
                                id="education"
                                name="education"
                                value={data.education}
                                onChange={handleChange}
                                className="form-control"
                            >
                                <option value="High School">High School</option>
                                <option value="Bachelor's Degree">Bachelor&#39;s Degree</option>
                                <option value="Master's Degree">Master&#39;s Degree</option>
                                <option value="Ph.D.">Ph.D.</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="itLevel">Level in IT:</label>
                            <select
                                id="itLevel"
                                name="itLevel"
                                value={data.itLevel}
                                onChange={handleChange}
                                className="form-control"
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                                <option value="Advanced">Experienced</option>
                            </select>
                        </div>

                        <div>
                            <details>
                                <summary>Choose the course you want to enroll</summary>
                                {/*<ul onInput={updateCourseFees}>*/}
                                <ul>
                                    <li>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="fc"
                                                value="Core Java"
                                                onChange={handleChangeCourses}
                                                checked={data.courses.includes("Core Java")}
                                            />
                                            Core Java
                                        </label>
                                    </li>

                                    <li>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="fc"
                                                value="Core Java + Project in Core Java"
                                                onChange={handleChangeCourses}
                                                checked={data.courses.includes("Core Java + Project in Core Java")}
                                            />
                                            Core Java + Project in Core Java
                                        </label>
                                    </li>

                                    <li>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="fc"
                                                value="Java Placement Batch"
                                                onChange={handleChangeCourses}
                                                checked={data.courses.includes("Java Placement Batch")}
                                            />
                                            Java Placement Batch
                                        </label>
                                    </li>
                                    <li>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="fc"
                                                value="Only Project in Java"
                                                onChange={handleChangeCourses}
                                                checked={data.courses.includes("Only Project in Java")}
                                            />
                                            Only Project in Java
                                        </label>
                                    </li>

                                    <li>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="fc"
                                                value="C language"
                                                onChange={handleChangeCourses}
                                                checked={data.courses.includes("C language")}
                                            />
                                            C language
                                        </label>
                                    </li>
                                    <li>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="fc"
                                                value="C++ language"
                                                onChange={handleChangeCourses}
                                                checked={data.courses.includes("C++ language")}
                                            />
                                            C++ language
                                        </label>
                                    </li>
                                    <li>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="fc"
                                                value="Python"
                                                onChange={handleChangeCourses}
                                                checked={data.courses.includes("Python")}
                                            />
                                            Python
                                        </label>
                                    </li>
                                    <li>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="fc"
                                                value="Python FullStack"
                                                onChange={handleChangeCourses}
                                                checked={data.courses.includes("Python FullStack")}
                                            />
                                            Python FullStack
                                        </label>
                                    </li>
                                    <li>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="fc"
                                                value="DSA"
                                                onChange={handleChangeCourses}
                                                checked={data.courses.includes("DSA")}
                                            />
                                            DSA
                                        </label>
                                    </li>
                                    <li>
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="fc"
                                                value="Front-end"
                                                onChange={handleChangeCourses}
                                                checked={data.courses.includes("Front-end")}
                                            />
                                            Front-end
                                        </label>
                                    </li>
                                </ul>
                            </details>

                            <div className="selected-courses-box">
                                <a>Selected Courses:</a>
                                <ul>
                                    {data.courses.map((courses, index) => (
                                        <li key={index}>{courses}</li>
                                    ))}
                                </ul>
                            </div>


                            <button onClick={updateCourseFees}> Confirm</button>
                        </div>

                        <div className="form-group">
                            <label htmlFor="paidFees">Paid Fees:</label>
                            <input
                                type="number"
                                id="paidFees"
                                name="paidFees"
                                value={data.paidFees}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>
                        <button
                            className="coupon-btn"
                            type="button"
                            onClick={() => setShowCoupon(!showCoupon)}
                        >
                            {showCoupon ? 'Hide Coupon <' : 'Apply Coupon >'}
                        </button>
                        {showCoupon && (
                            <div className="form-group">
                                <label htmlFor="couponCode">Coupon:</label>
                                <input
                                    type="text"
                                    id="couponCode"
                                    name="couponCode"
                                    value={data.couponCode}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                                <button className="coupon-btn" onClick={applyCoupon}> apply</button>
                                {/*<QrReader*/}
                                {/*    onResult={(result, error) => {*/}
                                {/*        if (!!result) {*/}
                                {/*            data.coupon = (result?.text);*/}
                                {/*        }*/}

                                {/*        if (!!error) {*/}
                                {/*            console.info(error);*/}
                                {/*        }*/}
                                {/*    }}*/}
                                {/*    style={{width: '100%'}}*/}
                                {/*/>*/}
                            </div>
                        )}
                        <button className="btn btn-primary submit-btn" type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </>
    )
}
