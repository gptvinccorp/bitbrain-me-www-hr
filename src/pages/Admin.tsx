import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, Filter, Trash2, Mail, LogOut, Home, RefreshCw, AlertCircle, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import LanguageSelector from '@/components/LanguageSelector';
import CandidateDetailModal from '@/components/CandidateDetailModal';
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
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth check error:', error);
          navigate('/admin-login');
          return;
        }

        if (session?.user) {
          setIsAuthenticated(true);
          setUser(session.user);
        } else {
          navigate('/admin-login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/admin-login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          setIsAuthenticated(false);
          setUser(null);
          navigate('/admin-login');
        } else if (session?.user) {
          setIsAuthenticated(true);
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
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
    if (isAuthenticated) {
      loadCandidates();
    }
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

  const handleViewDetails = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedCandidate(null);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Выход выполнен",
        description: "Вы успешно вышли из системы",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Ошибка выхода",
        description: "Произошла ошибка при выходе",
        variant: "destructive",
      });
    }
  };

  const handleSendEmail = async (candidate: Candidate) => {
    toast({
      title: "Отправка письма...",
      description: `Отправляем результаты кандидату ${candidate.name} (${candidate.email})`,
    });

    console.log('Начинаем отправку email для кандидата:', candidate);

    const result = await sendEmailToCandidate(candidate);
    
    if (result.success) {
      toast({
        title: "✅ Письмо отправлено!",
        description: `Результаты успешно отправлены ${candidate.name}`,
      });
    } else {
      console.error('Ошибка отправки email:', result.error);
      
      toast({
        title: "❌ Ошибка отправки",
        description: result.error || "Не удалось отправить письмо. Проверьте логи.",
        variant: "destructive",
      });

      // Показываем дополнительную информацию для разработчика
      if (result.error?.includes('You can only send testing emails')) {
        toast({
          title: "🔧 Настройка Resend",
          description: (
            <div className="space-y-2">
              <p>Для отправки на другие адреса нужно:</p>
              <ol className="list-decimal list-inside text-sm">
                <li>Верифицировать домен на resend.com/domains</li>
                <li>Изменить адрес отправителя в коде</li>
              </ol>
            </div>
          ),
          variant: "destructive",
        });
      }
    }
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

  const filteredCandidates = selectedTrack === 'all' 
    ? candidates 
    : candidates.filter(c => c.track === selectedTrack);

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'bg-green-100 text-green-800';
    if (score >= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const formatCompletionTime = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const exportData = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Track', 'Score', 'Completion Time', 'Date'].join(','),
      ...filteredCandidates.map(c => [
        c.name,
        c.email,
        c.phone || '',
        c.track,
        c.score,
        formatCompletionTime(c.completionTime),
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

  // Анализ распределения баллов
  const scoreDistribution = {
    high: candidates.filter(c => c.score >= 8).length,
    medium: candidates.filter(c => c.score >= 6 && c.score < 8).length,
    low: candidates.filter(c => c.score < 6).length
  };

  const averageScore = candidates.length > 0 
    ? (candidates.reduce((sum, c) => sum + c.score, 0) / candidates.length).toFixed(1)
    : '0';

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('admin.title')}</h1>
              {user && (
                <p className="text-sm text-gray-600">
                  Вошли как: {user.email}
                </p>
              )}
            </div>
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
        {/* Анализ точности подсчета баллов */}
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <BarChart3 className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-orange-800 mb-2">Анализ системы подсчета баллов</h3>
                <div className="text-sm text-orange-700 space-y-1">
                  <p>• Средний балл всех кандидатов: <strong>{averageScore}/10</strong></p>
                  <p>• Высокие баллы (8+): {scoreDistribution.high} из {candidates.length} ({candidates.length > 0 ? Math.round((scoreDistribution.high / candidates.length) * 100) : 0}%)</p>
                  <p>• Если большинство кандидатов получают высокие баллы, возможно, нужно:</p>
                  <ul className="list-disc list-inside ml-4 mt-2">
                    <li>Пересмотреть весовые коэффициенты вопросов</li>
                    <li>Добавить более сложные вопросы</li>
                    <li>Проверить правильность подсчета очков за ответы</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Testing Info */}
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-800 mb-2">Тестирование email отправки</h3>
                <div className="text-sm text-amber-700 space-y-1">
                  <p>• Текущий статус: используется Resend с базовым аккаунтом</p>
                  <p>• Для отправки на любые адреса нужно верифицировать домен на <a href="https://resend.com/domains" target="_blank" className="underline">resend.com/domains</a></p>
                  <p>• Без верификации домена письма отправляются только на email владельца аккаунта</p>
                  <p>• Все попытки отправки логируются в консоли браузера (F12)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
              Защищено аутентификацией Supabase
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
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{candidates.length}</div>
              <div className="text-gray-600">Total {t('admin.candidates')}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {scoreDistribution.high}
              </div>
              <div className="text-gray-600">High Scores (8+)</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {scoreDistribution.medium}
              </div>
              <div className="text-gray-600">Medium Scores (6-7)</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">
                {scoreDistribution.low}
              </div>
              <div className="text-gray-600">Low Scores (&lt;6)</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {averageScore}
              </div>
              <div className="text-gray-600">Average Score</div>
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
                <p>Загрузка данных...</p>
              </div>
            ) : candidates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Пока нет кандидатов. Результаты будут отображаться здесь после прохождения тестов.</p>
                <p className="text-sm mt-2">Данные защищены RLS политиками Supabase.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Phone</th>
                      <th className="text-left py-3 px-4">Track</th>
                      <th className="text-left py-3 px-4">{t('admin.score')}</th>
                      <th className="text-left py-3 px-4">Time</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCandidates.map((candidate) => (
                      <tr key={candidate.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{candidate.name}</td>
                        <td className="py-3 px-4">{candidate.email}</td>
                        <td className="py-3 px-4 text-sm">{candidate.phone || '—'}</td>
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
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatCompletionTime(candidate.completionTime)}
                        </td>
                        <td className="py-3 px-4">
                          {candidate.submittedAt.toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="flex items-center gap-2"
                              onClick={() => handleViewDetails(candidate)}
                            >
                              <Eye className="w-4 h-4" />
                              {t('admin.details')}
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleSendEmail(candidate)}
                              className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
                              title={`Отправить результаты на ${candidate.email}`}
                            >
                              <Mail className="w-4 h-4" />
                              Тест
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

      {/* Модальное окно с детальной информацией */}
      <CandidateDetailModal
        candidate={selectedCandidate}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
      />
    </div>
  );
};

export default Admin;
