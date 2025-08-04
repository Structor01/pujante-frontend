import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import Navbar from '../components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { BookOpen, Play, Clock, Search } from 'lucide-react';
import '../App.css';

const Trilhas = () => {
  const [trilhas, setTrilhas] = useState([]);
  const [filteredTrilhas, setFilteredTrilhas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTrilhas = async () => {
      try {
        const response = await api.get('/trilhas');
        setTrilhas(response.data);
        setFilteredTrilhas(response.data);
      } catch (error) {
        console.error('Erro ao carregar trilhas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrilhas();
  }, []);

  useEffect(() => {
    const filtered = trilhas.filter(trilha =>
      trilha.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trilha.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTrilhas(filtered);
  }, [searchTerm, trilhas]);

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Trilhas de Formação
          </h1>
          <p className="text-gray-600 mb-6">
            Desenvolva suas competências no agronegócio com nossos cursos especializados
          </p>
          
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar trilhas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Trilhas Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredTrilhas.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Nenhuma trilha encontrada' : 'Nenhuma trilha disponível'}
              </h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? 'Tente buscar com outros termos.' 
                  : 'As trilhas de formação estarão disponíveis em breve.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrilhas.map((trilha) => (
              <Card key={trilha.id} className="course-card overflow-hidden">
                {trilha.capa_url ? (
                  <div className="h-48 bg-gray-200">
                    <img
                      src={trilha.capa_url}
                      alt={trilha.titulo}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-primary/60" />
                  </div>
                )}
                
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">
                    {trilha.titulo}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {trilha.descricao}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
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
                    <Button className="w-full">
                      Acessar trilha
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Trilhas;

