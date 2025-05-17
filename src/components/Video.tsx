import { Box } from "@chakra-ui/react";

function Video() {
  return (
    <Box>
      {/* <div
        className="embed-responsive embed-responsive-16by9"
        style={{ position: "relative", paddingBottom: "56.25% !important" }}
      >
        <iframe
          width={640}
          height={360}
          src="https://vgallery.oss.net.bd/videoEmbed/173/codelab-sprint-management?channelName=_657a6d4fbe79c&modestbranding=1&showinfo=1&autoplay=&controls=1&loop=&mute=&t=0&objectFit="
          frameBorder={0}
          allow="fullscreen;autoplay;camera *;microphone *;"
          allowFullScreen="allowfullscreen"
          mozallowfullscreen="mozallowfullscreen"
          msallowfullscreen="msallowfullscreen"
          oallowfullscreen="oallowfullscreen"
          webkitallowfullscreen="webkitallowfullscreen"
          scrolling="no"
          videolengthinseconds={271}
        >
          iFrame is not supported!
        </iframe>
      </div> */}
      <Box
        as="iframe"
        src="https://vgallery.oss.net.bd/videoEmbed/173/codelab-sprint-management?channelName=_657a6d4fbe79c&modestbranding=1&showinfo=1&autoplay=1&controls=1&loop=&mute=&t=0&objectFit="
        w="500px"
        h="300px"
        border="none"
        allow="autoplay; loop"
        allowFullScreen
      />
    </Box>
  );
}

export default Video;
