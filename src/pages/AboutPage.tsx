import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import SubHeader from "@/components/SubHeader";

export default function AboutPage() {
  return (
    <>
      <SubHeader
        title="关于我们 About Us"
        backgroundImage="/images/Crew1.jpg"
      />

      <Box className="w-[80%] mx-auto pt-[80px] pb-[50px] text-center max-md:w-[90%]">
        <Box className="flex-1 px-0.5 max-w-[900px] mx-auto">
          <Typography
            variant="h4"
            sx={{ mb: 8 }}
            className="font-semibold text-[28px] leading-relaxed"
          >
            天璺科技（上海）有限公司
            <br />
            ZeroLab Technologies Co.,Ltd
          </Typography>
          <Typography
            variant="body1"
            className="text-base leading-[1.8] text-[#666] text-justify"
          >
            天璺科技专注于运动捕捉、具身智能遥操作及数据采集，提供自研低成本、高精度的无线运动捕捉SiP芯片、模组、全身惯性动作捕捉系统、遥操作平台及"如影随形"双足机器人高动态模仿平台等全栈解决方案。公司构建基于运动与遥操作技术的生态系统，建设"真人、真机、真实场景、真实工作"的具身智能数据库，助力泛化场景下的具身智能大脑训练。
          </Typography>
          <Link to="/contact" className="inline-block mt-5">
            <Button
              variant="outlined"
              className="border-[#08b4ce] text-[#08b4ce] hover:bg-[#08b4ce] hover:text-white normal-case"
            >
              了解更多
            </Button>
          </Link>
        </Box>
      </Box>
    </>
  );
}
