import React from "react"
import { useStyletron } from "baseui"
import { Input } from "baseui/input"
import { StyledLink } from "baseui/link";
import { Container, Row } from "react-grid-system"
import { Button } from "baseui/button";
import { HeadingXSmall } from "baseui/typography"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const Signup = () => {
    const navigate = useNavigate()
    const [css] = useStyletron()
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");

    const postUser = async () => {
        axios.post("https://rmbka7laza.execute-api.us-east-1.amazonaws.com/test/api/user/signup",{
            username,
            password,
            email
        }).then( (res) =>{
            console.log(res)
            window.alert("Sucesssssss");
            navigate("/login")
        })
      };

    return (
        <Container className={css({ maxHeight: "100%" })}>
            <Container className={css({ width: "50%", marginTop: "5rem", paddingBottom: "5rem", border: "1px solid grey" })}>
                <Row justify="center" className={css({ marginBottom: "1rem" })}>
                    <HeadingXSmall className={css({ textAlign: "center" })}>
                        Sign Up
                    </HeadingXSmall>
                </Row>
                <Container className={css({ width: "75%", })}>
                    <Row>
                        <Input
                            value={username}
                            type="username"
                            onChange={e => setUsername(e.target.value)}
                            placeholder="Username"
                            clearable
                            clearOnEscape
                        />
                    </Row>
                    <br />
                    <Row>
                        <Input
                            value={email}
                            type="email"
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Email"
                            clearable
                            clearOnEscape
                        />
                    </Row>
                    <br />
                    <Row>
                        <Input
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Password"
                            type="password"
                            clearable
                            clearOnEscape
                        />
                    </Row>
                    <br />
                    <Row>
                        <Input
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            placeholder="Confirm Password"
                            type="password"
                            clearable
                            clearOnEscape
                        />
                    </Row>
                    <br />
                    <Row>
                        <Button className={css({ width: "100%", marginBottom: "1rem"})}
                            onClick={() => postUser()}
                        >
                            SignUp
                        </Button>
                        <StyledLink href="/login" animateUnderline>
                            Have an account? Log In
                        </StyledLink>
                    </Row>
                </Container>
            </Container>
        </Container>
    )
}

export default Signup
