import React from "react";
import { BsDot } from "react-icons/bs";
import { Link } from "react-router-dom";

interface FooterProp {
  position: string; // This prop is used to display the text in the footer. For example, "�� 2022 Forum. All rights reserved."
}

const Footer: React.FC<FooterProp> = ({ position }) => {
  console.log(position);
  return (
    <div
      className={`text-xs text-neutral-400 flex flex-wrap gap-x-1 items-center justify-${position} py-3 mx-3`}
    >
      <Link to={"#"}>Giới thiệu </Link>
      <BsDot />
      <Link to={"#"}>Quy định sử dụng </Link>
      <BsDot />
      <Link to={"#"}>Tuyển dụng </Link>
      <BsDot />
      <Link to={"#"}>Quyền riêng tư </Link>
      <BsDot />
      <Link to={"#"}>Quảng cáo </Link>
      <BsDot />
      <Link to={"#"}>Tùy chọn quảng cáo </Link>
      <BsDot />
      <Link to={"#"}>Thông cáo </Link>
    </div>
  );
};

export default Footer;
