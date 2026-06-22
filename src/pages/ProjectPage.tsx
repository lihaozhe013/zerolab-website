import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import SubHeader from "@/components/SubHeader";
import VideoCard from "@/components/VideoCard";

const projectVideoSrcs = [
  "/videos/zl9nsq.mp4",
  "/videos/taiji.mp4",
  "/videos/h1.mp4",
];

export default function ProjectPage() {
  const { t } = useTranslation();
  const items = t("project.items", { returnObjects: true }) as { title: string; description: string }[];

  return (
    <>
      <SubHeader
        title={t("project.title")}
        backgroundImage="/images/Project.jpg"
      />

      <Box className="w-[80%] mx-auto py-[60px] max-md:w-[90%]">
        <Box className="flex justify-center max-md:flex-col">
          <Box className="flex-1 max-w-[800px]">
            {items.map((item, i) => (
              <VideoCard
                key={i}
                title={item.title}
                description={item.description}
                videoSrc={projectVideoSrcs[i]}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
}