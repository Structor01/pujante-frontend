import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import Navbar from '../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ArrowLeft, Play, Pause, Volume2, Maximize } from 'lucide-react';
import './App.css';

const AulaPlayer = () => {
  const { id } = useParams();
  const [aula, setAula] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
            <Card className="mb-6">
              <CardContent className="p-0">
                {aula.video_path || aula.video_url ? (
                  <div className="video-player">
                    <video
                      controls
                      className="w-full h-full"
                      poster={aula.thumbnail_url}
                    >
                      <source 
                        src={aula.video_url || `/uploads/videos/${aula.video_path?.split('/').pop()}`} 
                        type="video/mp4" 
                      />
                      Seu navegador não suporta o elemento de vídeo.
                    </video>
                  </div>
                ) : (
                  <div className="video-player flex items-center justify-center">
                    <div className="text-center text-white">
                      <Play className="h-16 w-16 mx-auto mb-4 opacity-60" />
                      <p className="text-lg">Vídeo não disponível</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Aula Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">
                      {aula.titulo}
                    </CardTitle>
                    <p className="text-gray-600">
                      {aula.modulo?.titulo} • Aula {aula.ordem}
                    </p>
                  </div>
                  {aula.duracao && (
                    <div className="text-sm text-gray-500">
                      {formatDuration(aula.duracao)}
                    </div>
                  )}
                </div>
              </CardHeader>
              {aula.descricao && (
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {aula.descricao}
                  </p>
                </CardContent>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {aula.modulo?.trilha?.titulo}
                </CardTitle>
                <p className="text-sm text-gray-600">
                  {aula.modulo?.titulo}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progresso:</span>
                    <span className="font-medium">1 de {aula.modulo?.aulas?.length || 1}</span>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ 
                        width: `${(1 / (aula.modulo?.aulas?.length || 1)) * 100}%` 
                      }}
                    ></div>
                  </div>
                  
                  <div className="pt-4 space-y-2">
                    <Button className="w-full" variant="outline">
                      Marcar como concluída
                    </Button>
                    <Link to={`/trilhas/${aula.modulo?.trilha?.id}`}>
                      <Button className="w-full" variant="secondary">
                        Ver todas as aulas
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Próximas aulas */}
            {aula.modulo?.aulas && aula.modulo.aulas.length > 1 && (
              <Card className="mt-6">
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
                                {formatDuration(proximaAula.duracao)}
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

