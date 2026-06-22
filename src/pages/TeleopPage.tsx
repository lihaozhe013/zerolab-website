import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import SubHeader from "@/components/SubHeader";
import VideoCard from "@/components/VideoCard";

const teleopVideoSrcs = [
  "/videos/openarmz_teleop.mp4",
  "/videos/如影随形.mp4",
  "/videos/如影随形2.mp4",
  "/videos/全身动捕控制睿尔曼类人形机器人.mp4",
  "/videos/亚欧博览会单臂.mp4",
];

export default function TeleopPage() {
  const { t } = useTranslation();
  const items = t("teleop.items", { returnObjects: true }) as { title: string; description: string }[];

  return (
    <>
      <SubHeader
        title={t("teleop.title")}
        backgroundImage="/images/Project.jpg"
      />

      {/* Whole Cycle Section */}
      <Box className="w-full">
        <Box className="w-[75%] mx-auto">
          <Typography variant="h5" className="font-semibold text-center leading-relaxed py-5">
            {t("teleop.subtitle_line1")}
            <br />
            {t("teleop.subtitle_line2")}
          </Typography>
          <Box className="text-center">
            <Box
              component="img"
              src="/images/whole cycle.png"
              alt={t("teleop.banner_alt")}
              className="max-w-full max-h-full"
            />
          </Box>
        </Box>
      </Box>

      {/* Videos Section */}
      <Box className="w-[80%] mx-auto py-[60px] max-md:w-[90%]">
        <Box className="flex justify-center max-md:flex-col">
          <Box className="flex-1 max-w-[800px]">
            {items.map((item, i) => (
              <VideoCard
                key={i}
                title={item.title}
                description={item.description}
                videoSrc={teleopVideoSrcs[i]}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
}