import React from "react";
import { Container, Row, Col } from "react-grid-system";
import { useStyletron } from "baseui";
import { Paragraph1 } from "baseui/typography";
import { navData } from "../Navbar";
import { Link } from "react-router-dom";
import { Button } from "baseui/button";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  const [css, theme] = useStyletron();
  const linkStyles = css({
    textDecoration: "none",
    color: theme.colors.primaryB,
    ":visited": {
      color: "inherit",
    },
  });
  const iconStyles = css({
    fontSize: "3rem",
  });
  const spacing = css({ marginTop: "1rem" });
  const textCenter = css({ textAlign: "center" });
  const padding = css({ padding: "1rem" });

  return (
    <div
      className={css({
        marginTop: "8rem",
        padding: "4rem 3rem 2rem 3rem",
        background: theme.colors.primaryA,
        color: theme.colors.primaryB,
      })}
    >
      <Container>
        <Row justify="center" className={spacing}>
          <Paragraph1
            margin="0"
            color={theme.colors.primaryB}
            className={textCenter}
          >
            Contact Us
          </Paragraph1>
        </Row>
        <Row justify="around" className={spacing}>
          <div
            className={css({
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-around",
            })}
          >
            <a
              className={`${spacing} ${textCenter} ${linkStyles} ${padding}`}
              href="https:/facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook className={iconStyles} />
            </a>
            <a
              className={`${spacing} ${textCenter} ${linkStyles} ${padding}`}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className={iconStyles} />
            </a>
            <a
              className={`${spacing} ${textCenter} ${linkStyles} ${padding}`}
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter className={iconStyles} />
            </a>
          </div>
        </Row>
        <Row justify="center" align="center" className={spacing}>
          <div
            className={css({
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
            })}
          >
            {navData.map((navItem) => (
              <Col key={navItem.shoe_id}>
                <Link className={linkStyles} to={navItem.link}>
                  <Button
                    overrides={{
                      BaseButton: {
                        style: {
                          color: theme.colors.primaryB,
                          ":hover": {
                            color: theme.colors.primaryA,
                          },
                        },
                      },
                    }}
                    size="default"
                    kind="tertiary"
                  >
                    {navItem.name}
                  </Button>
                </Link>
              </Col>
            ))}
          </div>
        </Row>
      </Container>
    </div>
  );
};

export default Footer;
