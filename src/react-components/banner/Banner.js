import React, { useState, useCallback } from "react";
import { RadioInputField } from "../input/RadioInputField";
import { RadioInputOption } from "../input/RadioInput";
import { Button } from "../input/Button";
import { CloseButton } from "../input/CloseButton";
import { useForm } from "react-hook-form";
import styles from "./Banner.scss";
import { ReactComponent as ArrowIcon } from "../icons/Arrow.svg";
import warning_icon from "../../assets/images/warning_icon.png";
import { TextInputField } from "../input/TextInputField";
import { CheckboxInput } from "../input/CheckboxInput";
import { FormattedMessage } from "react-intl";
import cone from "../../assets/images/cone.png";

const Banner = () => {
  const [email, setEmail] = useState("");
  const [confirm, setConfirm] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [responseStatus, setResponseStatus] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { handleSubmit, register } = useForm({
    defaultValues: {
      email_format: "html"
    }
  });

  /**
   * On Form Error
   */
  const newsletterError = () => {
    setResponseStatus(false);
    setSubmitted(true);
  };

  /**
   * On Form Success
   */
  const newsletterSuccess = () => {
    setResponseStatus(true);
    setSubmitted(true);
  };

  /**
   * On XHR Load
   * @param {Basket Response} resp
   * @returns
   */
  const onload = resp => {
    // Check Target Status
    const status = resp.target.status;
    if (status !== 200 || status > 300 || status < 200) {
      newsletterError();
      return;
    }

    // Check Response Status
    let response = resp.target.response;
    typeof response !== "object" ? (response = JSON.parse(response)) : "";
    if (response.status !== "ok") {
      newsletterError();
      return;
    }

    // Do success stuff here..
    newsletterSuccess();
  };

  const onSubmit = async data => {
    // Note: this is a pattern that was suggesed by the basket creator
    const url = "https://basket.mozilla.org/news/subscribe/";
    const xhr = new XMLHttpRequest();
    const params =
      "email=" +
      encodeURIComponent(data.email) +
      "&newsletters=" +
      "hubs" +
      "&lang=" +
      encodeURIComponent(navigator.languages[0]) +
      "&source_url=" +
      encodeURIComponent(window.location);

    xhr.onload = onload;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.timeout = 5000;
    xhr.ontimeout = newsletterError;
    xhr.responseType = "json";
    xhr.send(params);
  };

  /**
   * Emain input change
   */
  const onChangeEmail = useCallback(
    e => {
      setEmail(e.target.value);
    },
    [setEmail]
  );

  /**
   * Checkbox Confirm
   */
  const onConfirm = () => {
    setConfirm(state => !state);
  };

  /**
   * Checkbox Label
   * @returns JSX
   */
  const Label = () => {
    return (
      <>
        I’m okay with Mozilla handling my info as explained in this{" "}
        <a href="https://github.com/mozilla/hubs/blob/master/PRIVACY.md" target="_blank">
          Privacy Notice
        </a>
      </>
    );
  };

  /**
   * Post Submit Message
   * @param {Boolean} param
   * @returns JSX
   */
  const Messaging = ({ status }) => {
    return <>{status ? <Success /> : <Error />}</>;
  };

  /**
   * Success Message
   * @returns JSX
   */
  const Success = () => {
    return (
      <div className={styles.message_wrapper}>
        <img src={cone} alt="celebrate" className={styles.success_image} />
        <div>
          <h3 className={styles.message_title}>You're on the list</h3>
          <p className={styles.message_body}>
            Keep an eye out for product updates and an invite to join us as a tester in August.
          </p>
          <Button
            preset="primary"
            onClick={() => {
              setIsExpanded(false);
            }}
          >
            Got it
          </Button>
        </div>
      </div>
    );
  };

  /**
   * Error Message
   * @returns JSX
   */
  const Error = () => {
    return (
      <div className={styles.message_wrapper}>
        <div>
          <img src={warning_icon} alt="icon" className={styles.error_icon} />
        </div>
        <div>
          <h3 className={styles.message_title}>We ran into a problem</h3>
          <p className={styles.message_body}>
            Sorry, we were unable to add you to the mailing list, please try again later. If the problem persists please
            reach out on our <a href="https://discord.com/invite/dFJncWwHun" target='_blank'>Discord</a>.
          </p>
          <Button
            preset="primary"
            onClick={() => {
              setIsExpanded(false);
            }}
          >
            Got it
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.banner_wrapper}>
      <div className={styles.banner_container}>
        {/* BRANDING  */}
        <div className={styles.branding_container}>
          <h2>Join the next evolution of Hubs!</h2>
          <p>Be the first to get a sneak peek!</p>
        </div>

        <Button
          preset="primary"
          onClick={() => {
            setIsExpanded(true);
          }}
        >
          Find out More<span className={styles.down_arrow}>
            <ArrowIcon />
          </span>
        </Button>
      </div>

      {/* EXPAND CONTAINER  */}
      {isExpanded ? (
        <div className={styles.expand_wrapper}>
          <div className={styles.expand_container}>
            <div className={styles.expand_header}>
              <h2 className={styles.expand_title}>Join the next evolution of Hubs!</h2>
              <CloseButton
                onClick={() => {
                  setIsExpanded(false);
                }}
              />
            </div>

            <div className={styles.expand_contents}>
              {/* MESSAGING  */}
              <div className={styles.expand_messaging}>
                <p>We're working on a new service that makes it easier than ever to deploy a Hub of your own.</p>
                <p>
                  Sign up here to be the first to know about our new service, as well as the latest Hubs news, product
                  features and offerings. We can't wait to show you what we've been working on!
                </p>
              </div>

              {/* FORM  */}
              <form className={styles.expand_form} onSubmit={handleSubmit(onSubmit)}>
                {submitted ? (
                  <Messaging status={responseStatus} />
                ) : (
                  <div>
                    <TextInputField
                      ref={register}
                      name="email"
                      type="email"
                      label={<FormattedMessage id="email-address" defaultMessage="Email Address" />}
                      required
                      value={email}
                      onChange={onChangeEmail}
                      placeholder="example@example.com"
                      className={styles.expand_form_field}
                    />

                    <RadioInputField className={styles.expand_form_field} label="Format">
                      <RadioInputOption name="email_format" value="html" label="HTML" ref={register} />
                      <RadioInputOption name="email_format" value="text" label="Text" ref={register} />
                    </RadioInputField>

                    <CheckboxInput
                      className={styles.expand_form_field}
                      labelClassName={styles.checkbox_label}
                      tabIndex="0"
                      type="checkbox"
                      checked={confirm}
                      label={<Label />}
                      onChange={onConfirm}
                    />

                    {/* ACTIONS  */}
                    <div className={styles.expand_actions}>
                      <Button type="submit" preset="primary" disabled={!confirm}>
                        Join the Mailing List
                      </Button>
                      <Button
                        onClick={() => {
                          setIsExpanded(false);
                        }}
                      >
                        Not Interested
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Banner;