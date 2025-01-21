import React from "react";
import { BsDot } from "react-icons/bs";
import { Link } from "react-router-dom";

interface FooterProp{
  position: string;  // This prop is used to display the text in the footer. For example, "�� 2022 Forum. All rights reserved."
}

const Footer : React.FC<FooterProp> = ({position}) => {
  console.log(position)
  return (
    <div className={`text-xs text-neutral-400 flex flex-wrap gap-x-1 items-center justify-${position} py-3 mx-3`}>
      <Link to={"#"}>About </Link>
      <BsDot />
      <Link to={"#"}>Careers </Link>
      <BsDot />
      <Link to={"#"}>TermsPrivacy </Link>
      <BsDot />
      <Link to={"#"}>Acceptable Use </Link>
      <BsDot />
      <Link to={"#"}>Advertise </Link>
      <BsDot />
      <Link to={"#"}>Press </Link>
      <BsDot />
      <Link to={"#"}>Your Ad Choices </Link>
    </div>
  )
}

export default Footer