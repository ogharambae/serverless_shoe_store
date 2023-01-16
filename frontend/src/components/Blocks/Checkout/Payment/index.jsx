import React, { useState } from "react"
import { Row, Col } from "react-grid-system"
import { useForm, Controller } from "react-hook-form"
import { Button } from "baseui/button"
import { useStyletron } from "baseui"
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js"
import Stripe from "../Stripe"
import Axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import {
    paymentSucceeded,
    paymentFailed,
    clearCart,
    lastOrder,
} from "../../../../store/actions"
import { useNavigate } from "react-router-dom"
import { calculateSubtotal, tax, shipping } from "../CartInfo"
import Loader from "../Loader"
import { Input } from "baseui/input"


const Payment = ({ setStep }) => {
    const stripe = useStripe()
    const [loader, setLoader] = useState(false)
    const elements = useElements()
    const { control, handleSubmit, errors } = useForm()
    const dispatch = useDispatch()
    const items = useSelector((state) => state.cart?.items)
    const [css] = useStyletron()
    const navigate = useNavigate()
    const subtotal = calculateSubtotal(items)
    const total = subtotal + tax + shipping

    const getClientSecret = async (data) => {
        const res = await Axios.post(process.env.REACT_APP_API_URL, data)
        return { clientSecret: res.data.client_secret }
    }
    const onSubmit = async (data) => {
        setStep(2)
        setLoader(true)
        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return
        }
        try {
            const { clientSecret } = await getClientSecret({ amount: total })
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            })
            if (result.error) {
                // Show error to your customer (e.g., insufficient funds)
                console.log(result.error.message)
                setLoader(false)
                dispatch(paymentFailed(result.error.message))
            } else {
                // The payment has been processed!
                if (result.paymentIntent.status === "succeeded") {
                    setLoader(false)
                    dispatch(paymentSucceeded())
                    dispatch(
                        lastOrder({
                            items,
                            subtotal,
                            total,
                            tax,
                            shipping,
                        })
                    )
                    navigate("/success")
                    dispatch(clearCart())
                    // Show a success message to your customer
                    // There's a risk of the customer closing the window before callback
                    // execution. Set up a webhook or plugin to listen for the
                    // payment_intent.succeeded event that handles any business critical
                    // post-payment actions.
                }
            }
        } catch (error) {
            setLoader(false)
        }
    }

    // const api = 'https://nzv8s9m7vk.execute-api.eu-west-1.amazonaws.com/staging';
    // const data = { "promotionCode": "20dollarsOff" };
    // console.log(data);
    // Axios
    //     .post(api, data)
    //     .then((response) => {
    //         console.log(response);
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //     });


    const spacing = css({ margin: "2rem 0" })
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {loader && <Loader />}
            <Row>
                <Col className={spacing}>
                    <Stripe />
                </Col>
            </Row>
            <Row className={spacing}>
                <Col>
                    <Controller
                        as={Input}
                        control={control}
                        name="promoCode"
                        error={errors.promoCode}
                        // defaultValue={shippingState?.firstName}
                        // rules={{ required: true }}
                        placeholder={"Promotion Code (optional)"}
                    />
                </Col>
                <Col
                    className={css({
                        display: "flex",
                        justifyContent: "flex-end",
                    })}
                >
                    <Button type="submit">Apply Promotion Code</Button>
                </Col>
            </Row>
            <Row justify="end">
                <Col
                    className={css({
                        display: "flex",
                        justifyContent: "flex-end",
                    })}
                >
                    <Button disabled={loader} type="submit">
                        Checkout Securely
                    </Button>
                </Col>
            </Row>
        </form>
    )
}

export default Payment
