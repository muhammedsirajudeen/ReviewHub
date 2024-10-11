import axiosInstance from './axiosInstance';

const recordingHelper = (
  stream: MediaStream,
  id: string,
  authorization: string
) => {
  const mediarecorder = new MediaRecorder(stream);

  mediarecorder.ondataavailable = async (event) => {
    if (event.data.size > 0) {
      console.log(event.data);
      const formData = new FormData();
      formData.append(
        'video',
        event.data,
        `${authorization ?? 'user'}-${id}.webm`
      );
      try {
        const response = (
          await axiosInstance.post('/user/review/record', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
        ).data;
        if (response.message === 'success') {
          console.log('Posted');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  mediarecorder.start(2000);
};

export default recordingHelper;
