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
      
      {/* Hero Banner */}
      {featuredTrilha && (
        <div className="relative h-screen flex items-center" style={{ zIndex: 1 }}>
          {/* Background */}
          <div className="absolute inset-0">
            {featuredTrilha.capa_url ? (
              <img
                src={featuredTrilha.capa_url}
                alt={featuredTrilha.titulo}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-primary/40 to-accent/40"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
                Trilha em Destaque
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                {featuredTrilha.titulo}
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                {featuredTrilha.descricao}
              </p>

              <div className="flex items-center space-x-6 mb-8 text-lg">
                <span className="flex items-center">
                  <Play className="h-5 w-5 mr-2" />
                  {featuredTrilha.total_aulas} aulas
                </span>
                <span className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  {formatDuration(featuredTrilha.duracao_total)}
                </span>
                <span className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-400" />
                  4.9
                </span>
              </div>

              <div className="flex space-x-4">
                <Link to={`/trilhas/${featuredTrilha.id}`}>
                  <Button size="lg" className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg font-semibold">
                    <Play className="h-5 w-5 mr-2" />
                    Começar Agora
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-black px-8 py-3 text-lg font-semibold"
                >
                  Mais Informações
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Sections */}
      <div className="relative z-10 -mt-32 pb-20">
        {/* Continue Assistindo */}
        <section className="mb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Continue Assistindo</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recentAulas.map((aula) => (
                <div key={aula.id} className="group cursor-pointer">
                  <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden mb-3">
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
                  <h3 className="font-semibold text-sm mb-1 line-clamp-2">{aula.titulo}</h3>
                  <p className="text-gray-400 text-xs">{aula.trilha}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trilhas Populares */}
        <section className="mb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">Trilhas Populares</h2>
              <Link to="/trilhas" className="text-primary hover:text-primary/80">
                Ver todas
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {popularTrilhas.map((trilha) => (
                <Card key={trilha.id} className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors duration-300 group">
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
                    <CardTitle className="text-white text-lg line-clamp-2">
                      {trilha.titulo}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
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
                      <Button className="w-full bg-primary hover:bg-primary/90">
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
        <section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-8">Próximos Eventos</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.map((evento) => (
                <Card key={evento.id} className="bg-gray-900 border-gray-800 hover:bg-gray-800 transition-colors duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge className="mb-2 bg-red-600 text-white">
                          {formatDate(evento.data)}
                        </Badge>
                        <CardTitle className="text-white text-lg line-clamp-2">
                          {evento.titulo}
                        </CardTitle>
                      </div>
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-gray-400">
                        <Clock className="h-4 w-4 mr-2" />
                        {evento.hora}
                      </div>
                      <div className="flex items-center text-gray-400">
                        <Users className="h-4 w-4 mr-2" />
                        {evento.participantes} inscritos
                      </div>
                    </div>
                    
                    <p className="text-gray-300 mb-4">
                      Com {evento.palestrante}
                    </p>
                    
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Inscrever-se
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;

