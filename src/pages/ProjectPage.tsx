import { Box } from "@mui/material";
import SubHeader from "@/components/SubHeader";
import VideoCard from "@/components/VideoCard";

const videos = [
  {
    title: "行业大 V Joyce 为 ZeroLab 代言",
    videoSrc: "/videos/zl9nsq.mp4",
    description:
      "今天隆重推出的是天璺（Wen）科技 ZeroLab 最新出品的 AI 动捕芯片，专为提升姿态、角度、速度等效率而定制，这款芯片具有低功耗、高精度和超小体积的特点，以人类之魂入AI之窍，让光速旅行成真 #AI #人工智能 #动作捕捉 #动捕芯片 #人形机器人 #国产芯片 #ZeroLab",
  },
  {
    title: "太极专家采用 Zero Lab Full body MoCap 完成国粹数据采集",
    videoSrc: "/videos/taiji.mp4",
    description:
      "小小武魁课程体系创始人 阚一工 先生采用 ZeroLab 的无线全身动捕套装 采集 日月式 动作精华数据。Zero Lab Motion Tracker 具备数据稳定性强、精度高等特点，内嵌先进空间位置点捕捉矫正算法，可以采集到更精准的人体关节点位置信息，可快速佩戴、紧密贴合身体。超长8小时待机，不受场地限制，随时随地采集人体动作数据。",
  },
  {
    title: "Zero Lab H-1 Data Gloves For MR Application",
    videoSrc: "/videos/h1.mp4",
    description:
      "Zero Lab Data Gloves，是基于 MEMS 惯性传感器动作捕捉技术的手部动作数字化的交互手套，可以实时识别人体手指的动作姿态，在虚拟交互中呈现精细准确的五指运动。可以让使用者获得身临其境般的交互体验，放松地沉浸在对虚拟空间的探索里。",
  },
];

export default function ProjectPage() {
  return (
    <>
      <SubHeader title="产品方案 Project" backgroundImage="/images/Project.jpg" />

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
