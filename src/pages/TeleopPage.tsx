import { Box, Typography } from "@mui/material";
import SubHeader from "@/components/SubHeader";
import VideoCard from "@/components/VideoCard";

const videos = [
  {
    title: "OpenArmZ 动捕遥操作上肢机器人",
    videoSrc: "/videos/openarmz_teleop.mp4",
    description:
      "天璺客户出品的基于OpenArm优化的动捕操作上肢机器人，实现低成本超低延时远程遥操作方案。该系统可广泛应用于各种遥操作场景和数据采集任务，为工业自动化和机器人控制提供高效解决方案。#AI #人形机器人 #动作捕捉 #遥操作 #OpenArm #ZeroLab",
  },
  {
    title: "如影随形 - 真人实时操控宇树人形机器人",
    videoSrc: "/videos/如影随形.mp4",
    description:
      "通过ZeroLab动捕系统，实现真人实时操作宇树人形机器人，让机器人完美复刻人类动作，达到如影随形的效果。操作员的每一个细微动作都能被精准捕捉并实时传递给机器人，展现了人机交互的极致体验。#AI #人形机器人 #动作捕捉 #遥操作 #如影随形 #ZeroLab",
  },
  {
    title: "如影随形2 - 复杂场景下的人形机器人遥操作",
    videoSrc: "/videos/如影随形2.mp4",
    description:
      "在复杂环境中，ZeroLab动捕系统依然能够精准捕捉操作员的动作，并实时控制宇树人形机器人完成各种复杂任务。无论是精细的手部动作还是全身协调运动，机器人都能完美复刻，真正实现了人机合一的操控体验。",
  },
  {
    title: "Zerolab 动捕携手睿尔曼机械臂 傲意灵巧手打通动捕遥操作一体化解决方案",
    videoSrc: "/videos/全身动捕控制睿尔曼类人形机器人.mp4",
    description:
      "2024年底Zerolab 动捕打通机械臂和灵巧手重映射和遥操作一体化解决方案，实现了机械臂和灵巧手的联动控制，用户可以通过动捕系统实时采集到机械臂和灵巧手的动作数据，然后通过动捕系统将动作数据实时传输到机械臂和灵巧手。",
  },
  {
    title: "Zerolab动捕再次登陆亚欧博览会",
    videoSrc: "/videos/亚欧博览会单臂.mp4",
    description:
      "Zerolab动捕在亚欧博览会实时演示用户交互和现场物品抓取，证明惯性动捕在实现应用场景下的能力。",
  },
];

export default function TeleopPage() {
  return (
    <>
      <SubHeader
        title="人形机器人遥操作及数采方案"
        backgroundImage="/images/Project.jpg"
      />

      {/* Whole Cycle Section */}
      <Box className="w-full">
        <Box className="w-[75%] mx-auto">
          <Typography variant="h5" className="font-semibold text-center leading-relaxed py-5">
            人形机器人遥操作 数据采集 运动控制
            <br />
            模范学习 强化学习 全周期解决方案
          </Typography>
          <Box className="text-center">
            <Box
              component="img"
              src="/images/whole cycle.png"
              alt="全周期解决方案"
              className="max-w-full max-h-full"
            />
          </Box>
        </Box>
      </Box>

      {/* Videos Section */}
      <Box className="w-[80%] mx-auto py-[60px] max-md:w-[90%]">
        <Box className="flex justify-center max-md:flex-col">
          <Box className="flex-1 max-w-[800px]">
            {videos.map((video) => (
              <VideoCard key={video.title} {...video} />
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
}
