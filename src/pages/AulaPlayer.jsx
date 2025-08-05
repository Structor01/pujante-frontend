import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import Navbar from '../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Maximize, 
  SkipForward,
  SkipBack,
  Settings,
  CheckCircle,
  Clock,
  BookOpen
} from 'lucide-react';
import '../App.css';

const AulaPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  
  const [aula, setAula] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchAula = async () => {
      try {
        const response = await api.get(`/trilhas/aulas/${id}`);
        setAula(response.data);
      } catch (error) {
        console.error('Erro ao carregar aula:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAula();
  }, [id]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const updateProgress = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, [aula]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
  };

  const skipForward = () => {
    videoRef.current.currentTime += 10;
  };

  const skipBackward = () => {
    videoRef.current.currentTime -= 10;
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!document.fullscreenElement) {
      video.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const markAsCompleted = async () => {
    try {
      await api.post(`/trilhas/aulas/${id}/complete`);
      // Atualizar estado da aula como concluída
      setAula(prev => ({ ...prev, completed: true }));
    } catch (error) {
      console.error('Erro ao marcar aula como concluída:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="aspect-video bg-gray-200 rounded mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!aula) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center py-12">
            <CardContent>
              <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aula não encontrada
              </h3>
              <p className="text-gray-600 mb-4">
                A aula que você está procurando não existe ou foi removida.
              </p>
              <Link to="/trilhas">
                <Button>Voltar às trilhas</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link 
            to={`/trilhas/${aula.modulo?.trilha?.id}`}
            className="inline-flex items-center text-primary hover:text-primary/80"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar à trilha: {aula.modulo?.trilha?.titulo}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-3">
            <Card className="mb-6 overflow-hidden">
              <CardContent className="p-0">
                <div 
                  className="relative video-player group"
                  onMouseEnter={() => setShowControls(true)}
                  onMouseLeave={() => setShowControls(false)}
                >
                  {aula.video_path || aula.video_url ? (
                    <>
                      <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        poster={aula.thumbnail_url}
                        onClick={togglePlay}
                      >
                        <source 
                          src={aula.video_url || `/uploads/videos/${aula.video_path?.split('/').pop()}`} 
                          type="video/mp4" 
                        />
                        Seu navegador não suporta o elemento de vídeo.
                      </video>

                      {/* Custom Controls */}
                      <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                        {/* Play/Pause Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <button
                            onClick={togglePlay}
                            className="bg-black/50 hover:bg-black/70 text-white rounded-full p-4 transition-all duration-200 hover:scale-110"
                          >
                            {isPlaying ? (
                              <Pause className="h-8 w-8" />
                            ) : (
                              <Play className="h-8 w-8 ml-1" />
                            )}
                          </button>
                        </div>

                        {/* Bottom Controls */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          {/* Progress Bar */}
                          <div 
                            className="w-full h-2 bg-white/30 rounded-full mb-4 cursor-pointer"
                            onClick={handleSeek}
                          >
                            <div 
                              className="h-full bg-primary rounded-full transition-all duration-200"
                              style={{ width: `${progress}%` }}
                            />
                          </div>

                          {/* Control Buttons */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <button
                                onClick={skipBackward}
                                className="text-white hover:text-primary transition-colors"
                              >
                                <SkipBack className="h-5 w-5" />
                              </button>
                              
                              <button
                                onClick={togglePlay}
                                className="text-white hover:text-primary transition-colors"
                              >
                                {isPlaying ? (
                                  <Pause className="h-6 w-6" />
                                ) : (
                                  <Play className="h-6 w-6" />
                                )}
                              </button>

                              <button
                                onClick={skipForward}
                                className="text-white hover:text-primary transition-colors"
                              >
                                <SkipForward className="h-5 w-5" />
                              </button>

                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={toggleMute}
                                  className="text-white hover:text-primary transition-colors"
                                >
                                  {isMuted ? (
                                    <VolumeX className="h-5 w-5" />
                                  ) : (
                                    <Volume2 className="h-5 w-5" />
                                  )}
                                </button>
                                <input
                                  type="range"
                                  min="0"
                                  max="1"
                                  step="0.1"
                                  value={volume}
                                  onChange={handleVolumeChange}
                                  className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                                />
                              </div>

                              <span className="text-white text-sm">
                                {formatTime(currentTime)} / {formatTime(duration)}
                              </span>
                            </div>

                            <div className="flex items-center space-x-2">
                              <button
                                onClick={toggleFullscreen}
                                className="text-white hover:text-primary transition-colors"
                              >
                                <Maximize className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="video-player flex items-center justify-center bg-gray-900">
                      <div className="text-center text-white">
                        <Play className="h-16 w-16 mx-auto mb-4 opacity-60" />
                        <p className="text-lg">Vídeo não disponível</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Aula Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="secondary">
                        Aula {aula.ordem}
                      </Badge>
                      {aula.completed && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Concluída
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-2xl mb-2">
                      {aula.titulo}
                    </CardTitle>
                    <p className="text-gray-600">
                      {aula.modulo?.titulo} • {aula.modulo?.trilha?.titulo}
                    </p>
                  </div>
                  {aula.duracao && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {Math.floor(aula.duracao / 60)}:{(aula.duracao % 60).toString().padStart(2, '0')}
                    </div>
                  )}
                </div>
              </CardHeader>
              {aula.descricao && (
                <CardContent>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {aula.descricao}
                  </p>
                  
                  {!aula.completed && (
                    <Button onClick={markAsCompleted} className="w-full">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Marcar como concluída
                    </Button>
                  )}
                </CardContent>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  {aula.modulo?.trilha?.titulo}
                </CardTitle>
                <p className="text-sm text-gray-600">
                  {aula.modulo?.titulo}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Progresso:</span>
                      <span className="font-medium">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  
                  <div className="pt-4 space-y-2">
                    <Link to={`/trilhas/${aula.modulo?.trilha?.id}`}>
                      <Button className="w-full" variant="outline">
                        Ver todas as aulas
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Próximas aulas */}
            {aula.modulo?.aulas && aula.modulo.aulas.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Próximas aulas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {aula.modulo.aulas
                      .filter(a => a.id !== aula.id)
                      .slice(0, 3)
                      .map((proximaAula) => (
                      <Link 
                        key={proximaAula.id}
                        to={`/aulas/${proximaAula.id}`}
                        className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <Play className="h-4 w-4 text-primary flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium truncate">
                              {proximaAula.titulo}
                            </p>
                            {proximaAula.duracao && (
                              <p className="text-xs text-gray-500">
                                {Math.floor(proximaAula.duracao / 60)}:{(proximaAula.duracao % 60).toString().padStart(2, '0')}
                              </p>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AulaPlayer;

