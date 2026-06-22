import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import SubHeader from "@/components/SubHeader";

interface AppRowProps {
  title: string;
  description: string;
  image: string;
  reversed?: boolean;
}

function AppRow({ title, description, image, reversed = false }: AppRowProps) {
  return (
    <Box
      className={`flex flex-wrap justify-between gap-y-5 mb-5 ${
        reversed ? "flex-row-reverse" : ""
      } max-md:flex-col`}
    >
      <Box className="flex-1 min-w-[48%] max-md:min-w-full">
        <Box component="img" src={image} alt={title} className="w-full rounded" />
      </Box>
      <Box className="flex-1 min-w-[48%] max-md:min-w-full flex flex-col justify-center">
        <Typography variant="h4" sx={{ mb: 5 }} className="font-semibold">
          {title}
        </Typography>
        <Typography variant="body2" sx={{ mb: 5 }} className="text-[#777] leading-relaxed">
          {description}
        </Typography>
        <Link to="/contact" className="inline-block">
          <Button
            variant="outlined"
            className="border-[#08b4ce] text-[#08b4ce] hover:bg-[#08b4ce] hover:text-white normal-case"
          >
            了解更多
          </Button>
        </Link>
      </Box>
    </Box>
  );
}

const applications = [
  {
    title: "人形机器人训练",
    image: "/images/Robot Training.jpg",
    description:
      "采用惯性全身动作捕捉设备来采集人体动作数据，以训练人形机器人，是一个前沿且具有高效性的技术手段。与传统的基于摄像头的动作捕捉系统相比，惯性动作捕捉设备不受环境光线和遮挡的影响，适用于多种复杂环境下的数据采集。通过采集大量高质量的人体动作数据，可以为人形机器人的运动控制系统提供丰富的训练样本。",
  },
  {
    title: "虚拟制片",
    image: "/images/The virtual studio.jpg",
    description:
      "影视制作是动作捕捉的传统市场，科幻、奇幻、武侠、动画等题材的影视需要特效，尤其离不开动作捕捉系统的支持。随着技术的发展，基于惯性以及惯性/光学融合的高精度捕捉系统应运而生，它不仅大幅降低了成本，而且精度几乎能与光学捕捉系统媲美。",
  },
  {
    title: "体育运动",
    image: "/images/Sports training.jpg",
    description:
      "体育运动领域可分为两类市场：职业运动市场和业余爱好市场。比如在高尔夫、赛艇、击剑、跑步、足球等运动领域，我们可以通过精确捕捉动作，评测运动员的表现，改善他的运动技巧，比对竞争对手的同类数据等。",
  },
  {
    title: "游戏娱乐",
    image: "/images/VR Gaming.jpg",
    description:
      "动作捕捉的应用使得 VR 的体验者能够真正的得到沉浸式、交互式的体验感。技术发展也实现了大空间的多人 VR 交互，多人真实场地 VR 游戏以及 VR 虚拟教学。这也是元宇宙中的底层技术。",
  },
  {
    title: "虚拟主播",
    image: "/images/Virtual live.jpg",
    description:
      "动作捕捉的一大应用就是虚拟数字人，现在市面上的虚拟偶像、主播，如A-soul、柳叶熙、AYAYI、CodeMiko等，采用的都是以动作为捕捉为基础的虚拟数字人驱动技术，虚拟主播也已经成为了 B 站直播领域增长最快的主播品类。",
  },
  {
    title: "康复训练",
    image: "/images/Rehabilitation training.jpg",
    description:
      "借助动作捕捉技术得到的数据，可以广泛应用于各类体育运动以及康复训练中，为大家提供更加科学精确的动作指导。",
  },
];

export default function ApplicationPage() {
  return (
    <>
      <SubHeader title="应用领域 Application" />

      <Box className="w-[80%] mx-auto pt-[80px] pb-[50px] max-md:w-[90%]">
        {applications.map((app, index) => (
          <AppRow
            key={app.title}
            {...app}
            reversed={index % 2 === 1}
          />
        ))}
      </Box>
    </>
  );
}
