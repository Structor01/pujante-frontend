import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import Navbar from '../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Play, Clock, Calendar, Users, BookOpen, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import '../App.css';

const Home = () => {
  const [featuredTrilha, setFeaturedTrilha] = useState(null);
  const [recentAulas, setRecentAulas] = useState([]);
  const [popularTrilhas, setPopularTrilhas] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar trilhas
        const trilhasResponse = await api.get('/trilhas');
        const trilhas = trilhasResponse.data;
        
        if (trilhas.length > 0) {
          setFeaturedTrilha(trilhas[0]); // Primeira trilha como destaque
          setPopularTrilhas(trilhas.slice(0, 6)); // Primeiras 6 como populares
        }

        // Buscar aulas recentes (simulado)
        setRecentAulas([
          {
            id: 1,
            titulo: "Contratos de Arrendamento Rural",
            trilha: "Direito Agrário Avançado",
            duracao: 45,
            thumbnail: "/api/placeholder/300/200"
          },
          {
            id: 2,
            titulo: "Legislação Ambiental no Agronegócio",
            trilha: "Direito Ambiental Rural",
            duracao: 38,
            thumbnail: "/api/placeholder/300/200"
          },
          {
            id: 3,
            titulo: "Sucessão em Propriedades Rurais",
            trilha: "Direito Sucessório Rural",
            duracao: 52,
            thumbnail: "/api/placeholder/300/200"
          },
          {
            id: 4,
            titulo: "Tributação do Agronegócio",
            trilha: "Direito Tributário Rural",
            duracao: 41,
            thumbnail: "/api/placeholder/300/200"
          }
        ]);

        // Eventos próximos (simulado)
        setUpcomingEvents([
          {
            id: 1,
            titulo: "Webinar: Novas Regulamentações do INCRA",
            data: "2024-08-15",
            hora: "19:00",
            palestrante: "Dr. João Silva",
            participantes: 245
          },
          {
            id: 2,
            titulo: "Workshop: Contratos de Integração",
            data: "2024-08-20",
            hora: "14:00",
            palestrante: "Dra. Maria Santos",
            participantes: 156
          },
          {
            id: 3,
            titulo: "Live: Questões Trabalhistas no Campo",
            data: "2024-08-25",
            hora: "20:00",
            palestrante: "Dr. Carlos Oliveira",
            participantes: 189
          }
        ]);

      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="animate-pulse">
          <div className="h-screen bg-gray-800"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Hero Banner com Vídeo de Fundo */}
      <div className="relative h-screen flex items-center overflow-hidden" style={{ zIndex: 1 }}>
        {/* Vídeo de Fundo */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ minWidth: '100%', minHeight: '100%' }}
          onError={(e) => console.error('Erro ao carregar vídeo:', e)}
          onLoadStart={() => console.log('Iniciando carregamento do vídeo')}
          onCanPlay={() => console.log('Vídeo pode ser reproduzido')}
        >
          <source src="/hero-video-optimized.mp4" type="video/mp4" />
          <source src="/hero-video.mp4" type="video/mp4" />
          Seu navegador não suporta vídeos HTML5.
        </video>

        {/* Fallback: Imagem de fundo caso o vídeo não carregue */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
          style={{
            backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23064e3b;stop-opacity:1" /><stop offset="100%" style="stop-color:%23065f46;stop-opacity:1" /></linearGradient></defs><rect width="1920" height="1080" fill="url(%23grad)"/></svg>')`,
            display: 'block'
          }}
        ></div>

        {/* Overlay com 60% de transparência */}
        <div className="absolute inset-0 bg-black bg-opacity-60 z-10"></div>

        {/* Gradiente adicional para melhor legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>

        {/* Conteúdo do Hero */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <Badge className="mb-6 bg-primary/20 text-primary border-primary/30 text-lg px-4 py-2">
              🌱 Guardiões do Agronegócio
            </Badge>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
              Pujante
            </h1>
            
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-semibold mb-6 text-green-300">
              Portal Jurídico do Agronegócio
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
              Trilhas de formação especializadas, clube exclusivo e conteúdo de qualidade 
              para formar os melhores advogados do agronegócio brasileiro.
            </p>

            <div className="flex items-center space-x-8 mb-10 text-lg">
              <span className="flex items-center">
                <BookOpen className="h-6 w-6 mr-2" />
                Trilhas Especializadas
              </span>
              <span className="flex items-center">
                <Users className="h-6 w-6 mr-2" />
                Clube Exclusivo
              </span>
              <span className="flex items-center">
                <Star className="h-6 w-6 mr-2 text-yellow-400" />
                Conteúdo Premium
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/trilhas">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-black font-bold px-8 py-4 text-lg">
                  <Play className="h-6 w-6 mr-2" />
                  Explorar Trilhas
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg font-bold"
                >
                  Acessar Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Indicador de Scroll */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-20">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Seções de Conteúdo */}
      <div className="relative z-10 bg-black">
        {/* Continue Assistindo */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Continue Assistindo</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recentAulas.map((aula) => (
                <div key={aula.id} className="group cursor-pointer netflix-card">
                  <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden mb-4">
                    <img
                      src={aula.thumbnail}
                      alt={aula.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                      {formatDuration(aula.duracao)}
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{aula.titulo}</h3>
                  <p className="text-gray-400 text-sm">{aula.trilha}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trilhas Populares */}
        <section className="py-20 bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Trilhas Populares</h2>
              <Link to="/trilhas" className="text-primary hover:text-primary/80 text-lg font-semibold">
                Ver todas →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {popularTrilhas.map((trilha) => (
                <Card key={trilha.id} className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-all duration-300 group netflix-card">
                  <div className="relative aspect-video bg-gray-800 rounded-t-lg overflow-hidden">
                    {trilha.capa_url ? (
                      <img
                        src={trilha.capa_url}
                        alt={trilha.titulo}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-primary/60" />
                      </div>
                    )}
                  </div>
                  
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white text-xl line-clamp-2">
                      {trilha.titulo}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
                      <span className="flex items-center">
                        <Play className="h-4 w-4 mr-1" />
                        {trilha.total_aulas} aulas
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDuration(trilha.duracao_total)}
                      </span>
                    </div>
                    
                    <Link to={`/trilhas/${trilha.id}`}>
                      <Button className="w-full bg-primary hover:bg-primary/90 text-black font-semibold">
                        Acessar trilha
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Próximos Eventos */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Próximos Eventos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {upcomingEvents.map((evento) => (
                <Card key={evento.id} className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-all duration-300 netflix-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge className="mb-3 bg-red-600 text-white text-sm px-3 py-1">
                          {formatDate(evento.data)}
                        </Badge>
                        <CardTitle className="text-white text-xl line-clamp-2">
                          {evento.titulo}
                        </CardTitle>
                      </div>
                      <Calendar className="h-6 w-6 text-gray-400" />
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center text-gray-400">
                        <Clock className="h-5 w-5 mr-2" />
                        {evento.hora}
                      </div>
                      <div className="flex items-center text-gray-400">
                        <Users className="h-5 w-5 mr-2" />
                        {evento.participantes} inscritos
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-6 text-lg">
                      Com {evento.palestrante}
                    </p>
                    
                    <Button className="w-full bg-primary hover:bg-primary/90 text-black font-semibold">
                      Inscrever-se
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Final */}
        <section className="py-20 bg-gradient-to-r from-primary/20 to-accent/20">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Torne-se um Guardião do Agronegócio
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Junte-se à nossa comunidade exclusiva e tenha acesso a conteúdo premium, 
              networking qualificado e as melhores oportunidades do setor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/trilhas/criar">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-black font-bold px-8 py-4 text-lg">
                  Criar Trilha
                </Button>
              </Link>
              <Link to="/trilhas">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg font-bold"
                >
                  Explorar Conteúdo
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;

