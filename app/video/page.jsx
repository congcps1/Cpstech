import VideoGrid from '@/components/VideoGrid';
import { getVideos, YT_CHANNEL_URL } from '@/lib/youtube';

export const revalidate = 3600;
export const metadata = {
  title: 'Video',
  description: 'Video hướng dẫn lắp đặt, sử dụng, sửa lỗi máy chấm công, khóa vân tay, kiểm soát ra vào từ CPSTECH.',
};

export default async function VideoPage() {
  const videos = await getVideos(15);
  return (
    <div className="container page">
      <div className="section-head">
        <h1>Video hướng dẫn</h1>
        <a href={YT_CHANNEL_URL} target="_blank" rel="noopener" className="btn btn-sm btn-yt">Đăng ký kênh YouTube</a>
      </div>
      {videos.length ? (
        <VideoGrid videos={videos} />
      ) : (
        <div className="empty card">
          <p>Xem video tại kênh YouTube của CPSTECH.</p>
          <a className="btn" href={YT_CHANNEL_URL} target="_blank" rel="noopener">Mở kênh YouTube</a>
        </div>
      )}
    </div>
  );
}
