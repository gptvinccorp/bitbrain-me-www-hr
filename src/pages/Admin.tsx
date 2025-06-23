
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, Filter, Trash2, Mail, LogOut, Home, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import LanguageSelector from '@/components/LanguageSelector';
import { Candidate } from '@/types/assessment';
import { supabaseStorageService } from '@/services/supabaseStorage';
import { sendEmailToCandidate } from '@/services/email';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Admin = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<string>('all');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  // Проверка аутентификации
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin_logged_in') === 'true';
    if (!isLoggedIn) {
      navigate('/admin-login');
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  // Load candidates from Supabase
  const loadCandidates = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const candidatesData = await supabaseStorageService.getAllCandidates();
      setCandidates(candidatesData);
    } catch (error) {
      console.error('Error loading candidates:', error);
      toast({
        title: "Ошибка загрузки",
        description: "Не удалось загрузить данные кандидатов",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, [isAuthenticated]);

  // Set up real-time subscription
  useEffect(() => {
    if (!isAuthenticated) return;

    const channel = supabase
      .channel('candidates-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'candidates'
        },
        () => {
          console.log('New candidate added, refreshing data...');
          loadCandidates();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'candidates'
        },
        () => {
          console.log('Candidate deleted, refreshing data...');
          loadCandidates();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    navigate('/admin-login');
  };

  const handleSendEmail = async (candidate: Candidate) => {
    toast({
      title: "Отправка письма...",
      description: `Отправляем результаты кандидату ${candidate.name}`,
    });

    const success = await sendEmailToCandidate(candidate);
    
    if (success) {
      toast({
        title: "Письмо отправлено!",
        description: `Результаты успешно отправлены ${candidate.name}`,
      });
    } else {
      toast({
        title: "Ошибка отправки",
        description: "Не удалось отправить письмо. Попробуйте еще раз.",
        variant: "destructive",
      });
    }
  };

  const filteredCandidates = selectedTrack === 'all' 
    ? candidates 
    : candidates.filter(c => c.track === selectedTrack);

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'bg-green-100 text-green-800';
    if (score >= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const exportData = () => {
    const csvContent = [
      ['Name', 'Email', 'Track', 'Score', 'Date'].join(','),
      ...filteredCandidates.map(c => [
        c.name,
        c.email,
        c.track,
        c.score,
        c.submittedAt.toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `candidates_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleDeleteCandidate = async (candidateId: string) => {
    if (confirm('Are you sure you want to delete this candidate?')) {
      const success = await supabaseStorageService.deleteCandidateById(candidateId);
      if (success) {
        setCandidates(candidates.filter(c => c.id !== candidateId));
        toast({
          title: "Кандидат удален",
          description: "Данные кандидата успешно удалены",
        });
      } else {
        toast({
          title: "Ошибка удаления",
          description: "Не удалось удалить кандидата",
          variant: "destructive",
        });
      }
    }
  };

  const clearAllData = async () => {
    if (confirm('Are you sure you want to delete ALL candidate data? This cannot be undone.')) {
      const success = await supabaseStorageService.clearAllCandidates();
      if (success) {
        setCandidates([]);
        toast({
          title: "Все данные удалены",
          description: "Все данные кандидатов успешно удалены",
        });
      } else {
        toast({
          title: "Ошибка удаления",
          description: "Не удалось удалить все данные",
          variant: "destructive",
        });
      }
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">{t('admin.title')}</h1>
            <div className="flex items-center gap-2">
              <LanguageSelector />
              <Button 
                variant="outline" 
                onClick={loadCandidates}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Обновить
              </Button>
              <Button variant="outline" onClick={() => navigate('/')} className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                На главную
              </Button>
              <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Выход
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <select 
              value={selectedTrack}
              onChange={(e) => setSelectedTrack(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">All Tracks</option>
              <option value="sales">{t('track.sales')}</option>
              <option value="academy">{t('track.academy')}</option>
              <option value="creative">{t('track.creative')}</option>
            </select>
            <div className="text-sm text-gray-600">
              Данные обновляются в реальном времени из Supabase
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={exportData} className="flex items-center gap-2" disabled={candidates.length === 0}>
              <Download className="w-4 h-4" />
              {t('admin.export')}
            </Button>
            <Button onClick={clearAllData} variant="destructive" className="flex items-center gap-2" disabled={candidates.length === 0}>
              <Trash2 className="w-4 h-4" />
              Clear All
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{candidates.length}</div>
              <div className="text-gray-600">Total {t('admin.candidates')}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {candidates.filter(c => c.score >= 8).length}
              </div>
              <div className="text-gray-600">High Scores (8+)</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {candidates.filter(c => c.score >= 6 && c.score < 8).length}
              </div>
              <div className="text-gray-600">Medium Scores (6-7)</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">
                {candidates.filter(c => c.score < 6).length}
              </div>
              <div className="text-gray-600">Low Scores (&lt;6)</div>
            </CardContent>
          </Card>
        </div>

        {/* Candidates Table */}
        <Card>
          <CardHeader>
            <CardTitle>{t('admin.candidates')} ({filteredCandidates.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                <p>Загрузка данных из Supabase...</p>
              </div>
            ) : candidates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Пока нет кандидатов. Результаты будут отображаться здесь после прохождения тестов.</p>
                <p className="text-sm mt-2">Данные синхронизируются через Supabase и видны отовсюду.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Track</th>
                      <th className="text-left py-3 px-4">{t('admin.score')}</th>
                      <th className="text-left py-3 px-4">{t('admin.date')}</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCandidates.map((candidate) => (
                      <tr key={candidate.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{candidate.name}</td>
                        <td className="py-3 px-4">{candidate.email}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">
                            {t(`track.${candidate.track}`)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={getScoreColor(candidate.score)}>
                            {candidate.score}/10
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          {candidate.submittedAt.toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="flex items-center gap-2">
                              <Eye className="w-4 h-4" />
                              {t('admin.details')}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleSendEmail(candidate)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Mail className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDeleteCandidate(candidate.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
