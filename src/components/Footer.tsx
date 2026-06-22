import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box className="w-full text-center py-8 px-4">
      <Typography variant="h6" className="font-semibold mb-4 mt-4">
        关于我们 About Us
      </Typography>
      <Typography
        variant="body2"
        className="text-[#777] text-sm leading-relaxed"
      >
        天璺科技（上海）有限公司（ZeroLab）成立于 2021 年 9 月 18
        日，坐落于上海市杨浦区长阳创谷。
        <br />
        ZeroLab：让动作像文字一样被传递，让技能以光速点亮未来
      </Typography>
      <Box className="my-4">
        <Box
          component="img"
          src="/images/Wechat Accounts.jpg"
          alt="WeChat"
          className="max-w-[150px]"
        />
      </Box>
      <Typography variant="body2" className="text-[#777] text-sm">
        地址：上海市杨浦区长阳路1687号长阳创谷C3栋103-5室
        <br />
        电话：021-55809628
        <br />
        备案编号：沪 ICP 备 2021030591 号
      </Typography>
    </Box>
  );
}
