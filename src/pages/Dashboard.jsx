import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import api from '../lib/api';
import Navbar from '../components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { BookOpen, Play, Clock, Users } from 'lucide-react';
import './App.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [trilhas, setTrilhas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrilhas = async () => {
      try {
        const response = await api.get('/trilhas');
        setTrilhas(response.data);
      } catch (error) {
        console.error('Erro ao carregar trilhas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrilhas();
  }, []);

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
          <h1 className="text-3xl font-bold text-gray-900">
            Bem-vindo, {user?.nome}!
          </h1>
          <p className="text-gray-600 mt-2">
            Continue sua jornada de formação no agronegócio
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Trilhas Disponíveis
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trilhas.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Aulas Totais
              </CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {trilhas.reduce((total, trilha) => total + trilha.total_aulas, 0)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tempo Total
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatDuration(trilhas.reduce((total, trilha) => total + trilha.duracao_total, 0))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trilhas Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Trilhas de Formação
            </h2>
            <Link to="/trilhas">
              <Button variant="outline">
                Ver todas as trilhas
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : trilhas.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma trilha disponível
                </h3>
                <p className="text-gray-600">
                  As trilhas de formação estarão disponíveis em breve.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trilhas.slice(0, 6).map((trilha) => (
                <Card key={trilha.id} className="course-card overflow-hidden">
                  {trilha.capa_url && (
                    <div className="h-48 bg-gray-200">
                      <img
                        src={trilha.capa_url}
                        alt={trilha.titulo}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-lg">{trilha.titulo}</CardTitle>
                    <CardDescription className="line-clamp-2">
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
                        Começar trilha
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

