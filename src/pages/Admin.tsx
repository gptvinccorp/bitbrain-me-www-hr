
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Eye, Filter } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import { Candidate } from '@/types/assessment';

const Admin = () => {
  const { t } = useLanguage();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<string>('all');

  // Mock data for demonstration
  useEffect(() => {
    const mockCandidates: Candidate[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        track: 'sales',
        answers: [],
        score: 8,
        moduleScores: [],
        submittedAt: new Date('2024-01-15')
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+0987654321',
        track: 'creative',
        answers: [],
        score: 6,
        moduleScores: [],
        submittedAt: new Date('2024-01-14')
      },
      {
        id: '3',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        phone: '+1122334455',
        track: 'academy',
        answers: [],
        score: 9,
        moduleScores: [],
        submittedAt: new Date('2024-01-13')
      }
    ];
    setCandidates(mockCandidates);
  }, []);

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
    a.download = 'candidates.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">{t('admin.title')}</h1>
            <LanguageSelector />
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
          </div>
          
          <Button onClick={exportData} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            {t('admin.export')}
          </Button>
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
                        <Button variant="ghost" size="sm" className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          {t('admin.details')}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
