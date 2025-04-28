import React from 'react'
import '../styles/Akshay.css'
import { Button, Col, Form, Image, Row, Alert } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { submitContactForm, resetContactState } from '../redux/slices/contactSlice'
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import email from '../img/Ak_images/email.png'
import tele from '../img/Ak_images/tele.png'
import location from '../img/Ak_images/location.png'

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    phoneNo: Yup.string().matches(/^[0-9]{10}$/, 'Phone number must be 10 digits').required('Phone number is required'),
    subject: Yup.string().required('Subject is required'),
    message: Yup.string().required('Message is required').min(10, 'Message must be at least 10 characters')
})

export default function Contactus() {
    const dispatch = useDispatch()
    const { loading, error, success } = useSelector((state) => state.contact)

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        const result = await dispatch(submitContactForm(values))
        if (result.type === 'contact/submitContactForm/fulfilled') {
            resetForm()
        }
        setTimeout(() => {
            dispatch(resetContactState())
            setSubmitting(false)
        }, 3000)
    }

    return (
        <div>
            <div className='a_header_container'>
                <div className='g_pad_topbottom'>
                    <div className='g_why_us g_text_gredient'>Contact Us</div>
                    <div className='g_main_box'>
                        <Row>
                            <Col lg={8}>
                                <div className='g_message'>
                                    <p className='g_icon_p g_pad'>Send us a message</p>
                                    <div className='g_contact_box'>
                                        <div className="g_marpad">
                                            <Formik
                                                initialValues={{
                                                    name: '',
                                                    email: '',
                                                    phoneNo: '',
                                                    subject: '',
                                                    message: ''
                                                }}
                                                validationSchema={validationSchema}
                                                onSubmit={handleSubmit}
                                            >
                                                {({ isSubmitting }) => (
                                                    <FormikForm>
                                                        {error && <Alert variant="danger">{error}</Alert>}
                                                        {success && <Alert variant="success">Message sent successfully!</Alert>}
                                                        <Row className="mb-3">
                                                            <Form.Group as={Col} controlId="formGridName">
                                                                <Form.Label className='g_form_label'>Name</Form.Label>
                                                                <Field
                                                                    type="text"
                                                                    name="name"
                                                                    placeholder="Your name"
                                                                    className='g_Form_Control form-control'
                                                                />
                                                                <ErrorMessage name="name" component="div" className="text-danger" />
                                                            </Form.Group>

                                                            <Form.Group as={Col} controlId="formGridEmail">
                                                                <Form.Label className='g_form_label'>Email</Form.Label>
                                                                <Field
                                                                    type="email"
                                                                    name="email"
                                                                    placeholder="Your email"
                                                                    className='g_Form_Control form-control'
                                                                />
                                                                <ErrorMessage name="email" component="div" className="text-danger" />
                                                            </Form.Group>
                                                        </Row>
                                                        <Row className="mb-3">
                                                            <Form.Group as={Col} controlId="formGridPhone">
                                                                <Form.Label className='g_form_label'>Phone No.</Form.Label>
                                                                <Field
                                                                    type="text"
                                                                    name="phoneNo"
                                                                    placeholder="Your phone no."
                                                                    className='g_Form_Control form-control'
                                                                />
                                                                <ErrorMessage name="phoneNo" component="div" className="text-danger" />
                                                            </Form.Group>

                                                            <Form.Group as={Col} controlId="formGridsubject">
                                                                <Form.Label className='g_form_label'>Subject</Form.Label>
                                                                <Field
                                                                    type="text"
                                                                    name="subject"
                                                                    placeholder="Enter subject"
                                                                    className='g_Form_Control form-control'
                                                                />
                                                                <ErrorMessage name="subject" component="div" className="text-danger" />
                                                            </Form.Group>
                                                        </Row>
                                                        <Form.Group className="mb-3" controlId="formGridmessage">
                                                            <Form.Label className='g_form_label'>Message</Form.Label>
                                                            <Field
                                                                as="textarea"
                                                                name="message"
                                                                placeholder="Enter message"
                                                                className='g_Form_Control form-control'
                                                            />
                                                            <ErrorMessage name="message" component="div" className="text-danger" />
                                                        </Form.Group>
                                                        <Button
                                                            variant="primary"
                                                            type="submit"
                                                            // className='g_form_submit'
                                                            className='z_button px-5 mt-5'
                                                            disabled={isSubmitting || loading}
                                                        >
                                                            {loading ? 'Sending...' : 'Submit'}
                                                        </Button>
                                                    </FormikForm>
                                                )}
                                            </Formik>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col lg={4} className='g_contact_border'>
                                <div className='g_message'>
                                    <p className='g_icon_p g_pad'>Contact Details</p>
                                    <div className='g_contact_box'>
                                        <div className='d-flex align-items-center g_icon_marpad'>
                                            <div className='g_icon_background'>
                                                <Image src={email}></Image>
                                            </div>
                                            <div className='g_icon_text'>example123@gmail.com</div>
                                        </div>
                                        <div className='d-flex align-items-center g_icon_marpad'>
                                            <div className='g_icon_background'>
                                                <Image src={tele}></Image>
                                            </div>
                                            <div className='g_icon_text'>+91 3698527412</div>
                                        </div>
                                        <div className='d-flex align-items-center g_icon_marpad'>
                                            <div className='g_icon_background'>
                                                <Image src={location}></Image>
                                            </div>
                                            <div className='g_icon_text'>133, Lorem plot, 1st floor, Nr. queen street, opp. post office, Lorem, USA</div>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        </div>
    )
}
