import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import Navbar from '../components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { ArrowLeft, Play, Clock, BookOpen, CheckCircle } from 'lucide-react';
import './App.css';

const TrilhaDetalhes = () => {
  const { id } = useParams();
  const [trilha, setTrilha] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrilha = async () => {
      try {
        const response = await api.get(`/trilhas/${id}`);
        setTrilha(response.data);
      } catch (error) {
        console.error('Erro ao carregar trilha:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrilha();
  }, [id]);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!trilha) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Trilha não encontrada
              </h3>
              <p className="text-gray-600 mb-4">
                A trilha que você está procurando não existe ou foi removida.
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
            to="/trilhas" 
            className="inline-flex items-center text-primary hover:text-primary/80"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar às trilhas
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="mb-8">
              {trilha.capa_url && (
                <div className="h-64 bg-gray-200 rounded-lg mb-6 overflow-hidden">
                  <img
                    src={trilha.capa_url}
                    alt={trilha.titulo}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {trilha.titulo}
              </h1>
              
              <p className="text-gray-600 text-lg mb-6">
                {trilha.descricao}
              </p>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {trilha.modulos?.length || 0} módulos
                </span>
                <span className="flex items-center">
                  <Play className="h-4 w-4 mr-1" />
                  {trilha.total_aulas} aulas
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatDuration(trilha.duracao_total * 60)}
                </span>
              </div>
            </div>

            {/* Módulos */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Conteúdo da Trilha
              </h2>
              
              {trilha.modulos && trilha.modulos.length > 0 ? (
                <Accordion type="single" collapsible className="space-y-4">
                  {trilha.modulos
                    .sort((a, b) => a.ordem - b.ordem)
                    .map((modulo) => (
                    <AccordionItem key={modulo.id} value={`modulo-${modulo.id}`}>
                      <Card>
                        <AccordionTrigger className="px-6 py-4 hover:no-underline">
                          <div className="flex items-center justify-between w-full">
                            <div className="text-left">
                              <h3 className="font-semibold text-lg">
                                Módulo {modulo.ordem}: {modulo.titulo}
                              </h3>
                              {modulo.descricao && (
                                <p className="text-gray-600 text-sm mt-1">
                                  {modulo.descricao}
                                </p>
                              )}
                            </div>
                            <Badge variant="secondary">
                              {modulo.aulas?.length || 0} aulas
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4">
                          {modulo.aulas && modulo.aulas.length > 0 ? (
                            <div className="space-y-2">
                              {modulo.aulas
                                .sort((a, b) => a.ordem - b.ordem)
                                .map((aula) => (
                                <div 
                                  key={aula.id}
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                  <div className="flex items-center space-x-3">
                                    <Play className="h-4 w-4 text-primary" />
                                    <div>
                                      <h4 className="font-medium">
                                        {aula.titulo}
                                      </h4>
                                      {aula.descricao && (
                                        <p className="text-sm text-gray-600">
                                          {aula.descricao}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {aula.duracao && (
                                      <span className="text-sm text-gray-500">
                                        {formatDuration(aula.duracao)}
                                      </span>
                                    )}
                                    <Link to={`/aulas/${aula.id}`}>
                                      <Button size="sm" variant="outline">
                                        Assistir
                                      </Button>
                                    </Link>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 text-center py-4">
                              Nenhuma aula disponível neste módulo
                            </p>
                          )}
                        </AccordionContent>
                      </Card>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Conteúdo em desenvolvimento
                    </h3>
                    <p className="text-gray-600">
                      Os módulos desta trilha estarão disponíveis em breve.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Informações da Trilha</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Módulos:</span>
                  <span className="font-medium">{trilha.modulos?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Aulas:</span>
                  <span className="font-medium">{trilha.total_aulas}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duração:</span>
                  <span className="font-medium">{formatDuration(trilha.duracao_total * 60)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nível:</span>
                  <Badge variant="outline">Intermediário</Badge>
                </div>
                
                <div className="pt-4 border-t">
                  <Button className="w-full" size="lg">
                    Começar Trilha
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrilhaDetalhes;

