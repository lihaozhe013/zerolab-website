import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import PartnerCarousel from "@/components/PartnerCarousel";
import ApplicationCard from "@/components/ApplicationCard";

const products = [
  {
    title: "人形机器人遥操作和数采方案",
    image: "/images/openarmz.jpg",
    description:
      "基于ZeroLab先进的动作捕捉技术，为人形机器人提供高精度的遥操作控制和数据采集解决方案。通过实时动作捕捉，实现人机协同操作，广泛应用于工业制造、服务机器人、教育科研等领域。",
  },
  {
    title: "F1 全身动作捕捉套装",
    image: "/images/主图6.png",
    description:
      "F1 是一套全身动作捕捉系统，拥有 13 个无线姿态传感器，配备一套贴身、舒适的 Tracker 固定绑带，并且每条绑带均贴有固定在身体部位的提示标贴，便于使用者更快识别每根绑带的固定位置。支持快速、简单、可靠的动作数据捕捉。",
  },
  {
    title: "H1 开发者数据手套",
    image: "/images/主图4.png",
    description:
      "H1 Data Gloves 是一款名副其实的「高性价比、高精度、轻便佩戴的数据手套」，它每根手指拥有 10-bit 分辨率的高精度弯曲传感器结合低延迟通讯一体化的惯性姿态模块，可以实时捕捉手部精细动作，将其转化为数字信号。",
  },
  {
    title: "ZL9NSQ SiP 无线姿态传感芯片",
    image: "/images/主图5.png",
    description:
      "ZeroLab 超轻薄无线姿态传感器芯片 ZL9NSQ 适用于动作捕捉领域的低功耗、高精度 All-In-One 芯片级系统解决方案。运用行业最新的 Chiplet 技术，在极小的 10 x 10 x 2mm 的封装中实现了前所未有的集成度。",
  },
];

const applications = [
  { title: "MR混合现实", image: "/images/Designer (7).png" },
  {
    title: "机器人数据采集和遥操作",
    image: "/images/Designer (8).png",
  },
  { title: "体育训练", image: "/images/Designer (9).png" },
];

const environments = [
  {
    title: "ZeroLab 展示区",
    image: "/images/reception.png",
    description:
      "ZeroLab 的展示区融合现代、简约风格元素，营造了独特的科技氛围，展示了 ZeroLab 最新成果。",
  },
  {
    title: "ZeroLab 电子实验室",
    image: "/images/Lab.JPG",
    description:
      "ZeroLab 搭建了全方位的电子研究实验室，可以满足不同的电子产品的测试、研发需求。",
  },
  {
    title: "ZeroLab 超算数据中心",
    image: "/images/Datacenter.JPG",
    description:
      "ZeroLab 配备了先进的超算数据设备，可以覆盖软硬件、云计算、人工智能方面的运算能力。",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Box
        className="min-h-screen w-full bg-cover bg-center relative flex flex-col"
        sx={{
          backgroundImage:
            "linear-gradient(rgba(4,9,30,0.7),rgba(4,9,30,0.7)),url(/images/banner.png)",
        }}
      >
        <Navbar transparent />
        <Box className="flex-1 flex items-center justify-center text-center text-white px-4">
          <Box className="max-w-[90%]">
            <Typography
              variant="h1"
              className="text-[62px] font-semibold max-md:text-[25px]"
            >
              We Make Reality Better
            </Typography>
            <Typography
              variant="body1"
              className="text-xl mt-2.5 mb-10 leading-relaxed max-md:text-base"
            >
              在过去的 200
              年里，人类依次借助电磁波传递了文字、声音与图像，极大地拓展了我们的思想、听觉与视觉。
              <br />
              如今，ZeroLab
              正在通过可穿戴动作捕捉技术，将人类的动作本身转化为可传递的信息。借助机器人替身，人类将能够实现"光速旅行"，远程执行作业，并把技能传递给硅基生命，训练出属于机器人的大脑。
            </Typography>
            <Link to="/about">
              <Button
                variant="outlined"
                className="text-white border-white px-8 py-3 text-[13px] hover:border-[#08b4ce] hover:bg-[#08b4ce] transition-all duration-1000 normal-case"
              >
                了解更多
              </Button>
            </Link>
          </Box>
        </Box>
      </Box>

      {/* Partners Section */}
      <PartnerCarousel />

      {/* Products Section */}
      <Box className="w-[80%] mx-auto text-center pt-[100px] max-md:w-[90%]">
        <Typography variant="h4" className="font-semibold mb-3">
          我们的产品 Products
        </Typography>
        <Typography
          variant="body2"
          className="text-[#777] mb-10 leading-relaxed"
        >
          ZeroLab 提供从无线动作捕捉芯片到人形机器人遥操作和数据采集的完整方案
        </Typography>
        <Box className="flex flex-wrap justify-between gap-y-5 max-md:flex-col">
          {products.map((product) => (
            <Box
              key={product.title}
              className="flex-1 min-w-[48%] bg-[#dbdbdb] rounded-lg p-5 transition-shadow duration-500 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)] max-md:min-w-full"
            >
              <Typography
                variant="h6"
                className="font-semibold text-center mb-2.5"
              >
                {product.title}
              </Typography>
              <Box
                component="img"
                src={product.image}
                alt={product.title}
                className="w-full h-[400px] object-cover rounded my-2.5 max-md:h-[250px]"
              />
              <Typography
                variant="body2"
                className="text-[#777] text-sm leading-relaxed"
              >
                {product.description}
              </Typography>
              <Link to="/product">
                <Button
                  variant="outlined"
                  className="mt-4 border-[#08b4ce] text-[#08b4ce] hover:bg-[#08b4ce] hover:text-white normal-case"
                >
                  了解更多
                </Button>
              </Link>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Applications Section */}
      <Box className="w-[80%] mx-auto text-center pt-[50px] max-md:w-[90%]">
        <Typography variant="h4" className="font-semibold mb-3">
          应用场景 Application
        </Typography>
        <Typography
          variant="body2"
          className="text-[#777] mb-10 leading-relaxed"
        >
          ZeroLab
          的产品可以将人体动作数字化，应用于增强虚拟现实游戏的沉浸感，制作逼真的CG影视人物动画效果。
        </Typography>
        <Box className="flex flex-wrap justify-between gap-5 max-md:flex-col">
          {applications.map((app) => (
            <ApplicationCard key={app.title} {...app} />
          ))}
        </Box>
      </Box>

      {/* Environment Section */}
      <Box className="w-[80%] mx-auto text-center pt-[100px] max-md:w-[90%]">
        <Typography variant="h4" className="font-semibold mb-3">
          我们的环境 Environment
        </Typography>
        <Typography
          variant="body2"
          className="text-[#777] mb-10 leading-relaxed"
        >
          ZeroLab
          是一家研究型科技公司，我们配备了全方位的电子实验室设备，同时搭建了自己的超算数据中心。
        </Typography>
        <Box className="flex flex-wrap justify-between gap-y-5 max-md:flex-col">
          {environments.map((env) => (
            <Box
              key={env.title}
              className="flex-1 min-w-[31%] max-md:min-w-full"
            >
              <Box
                component="img"
                src={env.image}
                alt={env.title}
                className="w-full rounded-lg"
              />
              <Typography
                variant="h6"
                className="font-semibold text-left mt-4 mb-3"
              >
                {env.title}
              </Typography>
              <Typography
                variant="body2"
                className="text-[#777] text-left leading-relaxed"
              >
                {env.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* CTA Section */}
      <Box
        className="my-[100px] mx-auto w-[80%] bg-cover bg-center rounded-lg text-center py-[100px] max-md:py-16"
        sx={{
          backgroundImage:
            "linear-gradient(rgba(40,40,40,0.7),rgba(40,40,40,0.7)),url(/images/Cooperation.jpg)",
        }}
      >
        <Typography variant="h4" className="text-white font-semibold mb-10">
          期待与您建立合作
        </Typography>
        <Link to="/contact">
          <Button
            variant="outlined"
            className="text-white border-white px-8 py-3 text-[13px] hover:border-[#08b4ce] hover:bg-[#08b4ce] transition-all duration-1000 normal-case"
          >
            联系我们
          </Button>
        </Link>
      </Box>
    </>
  );
}
