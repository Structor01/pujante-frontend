import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import Navbar from '../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { ArrowLeft, Plus, Trash2, Upload, BookOpen, Play } from 'lucide-react';
import '../App.css';

const CriarTrilha = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [trilha, setTrilha] = useState({
    titulo: '',
    descricao: '',
    capa: null
  });

  const [modulos, setModulos] = useState([
    {
      titulo: '',
      descricao: '',
      ordem: 1,
      aulas: [
        {
          titulo: '',
          descricao: '',
          ordem: 1,
          video: null
        }
      ]
    }
  ]);

  const handleTrilhaChange = (field, value) => {
    setTrilha(prev => ({ ...prev, [field]: value }));
  };

  const handleModuloChange = (moduloIndex, field, value) => {
    setModulos(prev => prev.map((modulo, index) => 
      index === moduloIndex ? { ...modulo, [field]: value } : modulo
    ));
  };

  const handleAulaChange = (moduloIndex, aulaIndex, field, value) => {
    setModulos(prev => prev.map((modulo, mIndex) => 
      mIndex === moduloIndex ? {
        ...modulo,
        aulas: modulo.aulas.map((aula, aIndex) => 
          aIndex === aulaIndex ? { ...aula, [field]: value } : aula
        )
      } : modulo
    ));
  };

  const adicionarModulo = () => {
    setModulos(prev => [...prev, {
      titulo: '',
      descricao: '',
      ordem: prev.length + 1,
      aulas: [
        {
          titulo: '',
          descricao: '',
          ordem: 1,
          video: null
        }
      ]
    }]);
  };

  const removerModulo = (index) => {
    if (modulos.length > 1) {
      setModulos(prev => prev.filter((_, i) => i !== index));
    }
  };

  const adicionarAula = (moduloIndex) => {
    setModulos(prev => prev.map((modulo, index) => 
      index === moduloIndex ? {
        ...modulo,
        aulas: [...modulo.aulas, {
          titulo: '',
          descricao: '',
          ordem: modulo.aulas.length + 1,
          video: null
        }]
      } : modulo
    ));
  };

  const removerAula = (moduloIndex, aulaIndex) => {
    setModulos(prev => prev.map((modulo, mIndex) => 
      mIndex === moduloIndex ? {
        ...modulo,
        aulas: modulo.aulas.filter((_, aIndex) => aIndex !== aulaIndex)
      } : modulo
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // 1. Criar trilha
      const formDataTrilha = new FormData();
      formDataTrilha.append('titulo', trilha.titulo);
      formDataTrilha.append('descricao', trilha.descricao);
      if (trilha.capa) {
        formDataTrilha.append('capa', trilha.capa);
      }

      const trilhaResponse = await api.post('/trilhas', formDataTrilha, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const trilhaId = trilhaResponse.data.id;

      // 2. Criar módulos e aulas
      for (const [moduloIndex, modulo] of modulos.entries()) {
        const moduloData = {
          titulo: modulo.titulo,
          descricao: modulo.descricao,
          ordem: moduloIndex + 1,
          trilha_id: trilhaId
        };

        const moduloResponse = await api.post('/trilhas/modulos', moduloData);
        const moduloId = moduloResponse.data.id;

        // 3. Criar aulas do módulo
        for (const [aulaIndex, aula] of modulo.aulas.entries()) {
          const formDataAula = new FormData();
          formDataAula.append('titulo', aula.titulo);
          formDataAula.append('descricao', aula.descricao);
          formDataAula.append('ordem', aulaIndex + 1);
          formDataAula.append('modulo_id', moduloId);
          
          if (aula.video) {
            formDataAula.append('video', aula.video);
          }

          await api.post('/trilhas/aulas', formDataAula, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
      }

      setSuccess('Trilha criada com sucesso!');
      setTimeout(() => {
        navigate('/trilhas');
      }, 2000);

    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao criar trilha');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/trilhas')}
            className="inline-flex items-center text-primary hover:text-primary/80 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar às trilhas
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">
            Criar Nova Trilha
          </h1>
          <p className="text-gray-600 mt-2">
            Crie uma trilha de formação completa com módulos e aulas
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informações da Trilha */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                Informações da Trilha
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="titulo">Título da Trilha *</Label>
                <Input
                  id="titulo"
                  value={trilha.titulo}
                  onChange={(e) => handleTrilhaChange('titulo', e.target.value)}
                  placeholder="Ex: Direito do Agronegócio Avançado"
                  required
                />
              </div>

              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={trilha.descricao}
                  onChange={(e) => handleTrilhaChange('descricao', e.target.value)}
                  placeholder="Descrição detalhada da trilha..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="capa">Capa da Trilha</Label>
                <Input
                  id="capa"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleTrilhaChange('capa', e.target.files[0])}
                />
              </div>
            </CardContent>
          </Card>

          {/* Módulos */}
          {modulos.map((modulo, moduloIndex) => (
            <Card key={moduloIndex}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Módulo {moduloIndex + 1}
                  </CardTitle>
                  {modulos.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removerModulo(moduloIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Título do Módulo *</Label>
                  <Input
                    value={modulo.titulo}
                    onChange={(e) => handleModuloChange(moduloIndex, 'titulo', e.target.value)}
                    placeholder="Ex: Fundamentos do Direito Agrário"
                    required
                  />
                </div>

                <div>
                  <Label>Descrição do Módulo</Label>
                  <Textarea
                    value={modulo.descricao}
                    onChange={(e) => handleModuloChange(moduloIndex, 'descricao', e.target.value)}
                    placeholder="Descrição do módulo..."
                    rows={2}
                  />
                </div>

                {/* Aulas do Módulo */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">Aulas</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => adicionarAula(moduloIndex)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Aula
                    </Button>
                  </div>

                  {modulo.aulas.map((aula, aulaIndex) => (
                    <div key={aulaIndex} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-sm flex items-center">
                          <Play className="h-4 w-4 mr-2" />
                          Aula {aulaIndex + 1}
                        </h5>
                        {modulo.aulas.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removerAula(moduloIndex, aulaIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Título da Aula *</Label>
                          <Input
                            value={aula.titulo}
                            onChange={(e) => handleAulaChange(moduloIndex, aulaIndex, 'titulo', e.target.value)}
                            placeholder="Ex: Introdução aos Contratos Agrários"
                            required
                          />
                        </div>

                        <div>
                          <Label>Vídeo da Aula</Label>
                          <Input
                            type="file"
                            accept="video/*"
                            onChange={(e) => handleAulaChange(moduloIndex, aulaIndex, 'video', e.target.files[0])}
                          />
                        </div>
                      </div>

                      <div className="mt-3">
                        <Label>Descrição da Aula</Label>
                        <Textarea
                          value={aula.descricao}
                          onChange={(e) => handleAulaChange(moduloIndex, aulaIndex, 'descricao', e.target.value)}
                          placeholder="Descrição da aula..."
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Botão Adicionar Módulo */}
          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={adicionarModulo}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Módulo
            </Button>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/trilhas')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Criando...' : 'Criar Trilha'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CriarTrilha;

