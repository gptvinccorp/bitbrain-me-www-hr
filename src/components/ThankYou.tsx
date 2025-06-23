
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, Loader2, Mail, Database } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Candidate } from '@/types/assessment';
import { supabaseStorageService } from '@/services/supabaseStorage';
import { sendEmailToCandidate } from '@/services/email';
import { useToast } from '@/hooks/use-toast';

interface ThankYouProps {
  candidate: Candidate;
  completionTime?: number;
  onStartNew: () => void;
}

const ThankYou: React.FC<ThankYouProps> = ({ candidate, completionTime, onStartNew }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [savingState, setSavingState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [emailState, setEmailState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorDetails, setErrorDetails] = useState<string>('');

  useEffect(() => {
    const saveAndSendEmail = async () => {
      console.log('=== STARTING SAVE AND EMAIL PROCESS ===');
      
      // Step 1: Save to database
      setSavingState('saving');
      setErrorDetails('');
      
      try {
        console.log('Attempting to save candidate:', candidate.name);
        const saveSuccess = await supabaseStorageService.saveCandidate(candidate, completionTime);
        
        if (saveSuccess) {
          console.log('✅ Candidate saved successfully');
          setSavingState('saved');
          
          toast({
            title: t('thankYou.dataSaved'),
            description: t('thankYou.dataSavedDesc'),
          });

          // Step 2: Send email (only if saving was successful)
          setEmailState('sending');
          
          try {
            console.log('Attempting to send email to:', candidate.email);
            const emailResult = await sendEmailToCandidate(candidate);
            
            if (emailResult.success) {
              console.log('✅ Email sent successfully');
              setEmailState('sent');
              
              toast({
                title: t('thankYou.emailSent'),
                description: t('thankYou.emailSentDesc'),
              });
            } else {
              console.error('❌ Email sending failed:', emailResult.error);
              setEmailState('error');
              setErrorDetails(emailResult.error || t('thankYou.emailError'));
              
              toast({
                title: t('thankYou.emailErrorTitle'),
                description: emailResult.error || t('thankYou.emailError'),
                variant: "destructive",
              });
            }
          } catch (emailError: any) {
            console.error('❌ Critical email error:', emailError);
            setEmailState('error');
            setErrorDetails(`${t('thankYou.criticalError')}: ${emailError.message || t('thankYou.unknownError')}`);
            
            toast({
              title: t('thankYou.criticalEmailError'),
              description: t('thankYou.criticalEmailErrorDesc'),
              variant: "destructive",
            });
          }
          
        } else {
          console.error('❌ Failed to save candidate');
          setSavingState('error');
          setErrorDetails(t('thankYou.saveError'));
          
          toast({
            title: t('thankYou.saveErrorTitle'),
            description: t('thankYou.saveErrorDesc'),
            variant: "destructive",
          });
        }
        
      } catch (saveError: any) {
        console.error('❌ Critical save error:', saveError);
        setSavingState('error');
        setErrorDetails(`${t('thankYou.criticalSaveError')}: ${saveError.message || t('thankYou.unknownError')}`);
        
        toast({
          title: t('thankYou.criticalErrorTitle'),
          description: t('thankYou.criticalErrorDesc'),
          variant: "destructive",
        });
      }
    };

    saveAndSendEmail();
  }, [candidate, completionTime, toast, t]);

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreDescription = (score: number) => {
    if (score >= 8) return t('results.excellent');
    if (score >= 6) return t('results.good');
    return t('results.needsImprovement');
  };

  const StatusIcon = ({ state }: { state: 'idle' | 'saving' | 'saved' | 'error' | 'sending' | 'sent' }) => {
    switch (state) {
      case 'saving':
      case 'sending':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-600" />;
      case 'saved':
      case 'sent':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <div className="w-5 h-5 bg-gray-300 rounded-full" />;
    }
  };

  const getStatusText = (state: 'idle' | 'saving' | 'saved' | 'error' | 'sending' | 'sent') => {
    switch (state) {
      case 'saving':
        return t('thankYou.savingData');
      case 'saved':
        return t('thankYou.dataSaved');
      case 'sending':
        return t('thankYou.sendingEmail');
      case 'sent':
        return t('thankYou.emailSent');
      case 'error':
        return t('thankYou.error');
      default:
        return t('thankYou.waiting');
    }
  };

  const getTrackName = (track: string) => {
    switch (track) {
      case 'sales':
        return t('track.sales');
      case 'academy':
        return t('track.academy');
      case 'creative':
        return t('track.creative');
      default:
        return track;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">
            {t('thankYou.title')}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <p className="text-lg text-gray-700">
            {t('thankYou.message')}
          </p>

          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">{t('results.yourScore')}</h3>
            <div className={`text-4xl font-bold ${getScoreColor(candidate.score)}`}>
              {candidate.score}/10
            </div>
            <p className="text-gray-600 mt-2">
              {getScoreDescription(candidate.score)}
            </p>
          </div>

          {/* Status indicators */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 text-gray-700">{t('thankYou.processingStatus')}:</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded border">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-gray-600" />
                  <span>{t('thankYou.savingToDatabase')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusIcon state={savingState} />
                  <span className="text-sm font-medium">{getStatusText(savingState)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-white rounded border">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <span>{t('thankYou.sendingToEmail')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusIcon state={emailState} />
                  <span className="text-sm font-medium">{getStatusText(emailState)}</span>
                </div>
              </div>
            </div>

            {errorDetails && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-sm text-red-700">
                  <strong>{t('thankYou.errorDetails')}:</strong> {errorDetails}
                </p>
              </div>
            )}
          </div>

          <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded">
            <p className="mb-2">
              <strong>{t('thankYou.track')}:</strong> {getTrackName(candidate.track)}
            </p>
            <p className="mb-2">
              <strong>Email:</strong> {candidate.email}
            </p>
            {completionTime && (
              <p>
                <strong>{t('thankYou.completionTime')}:</strong> {Math.round(completionTime / 60)} {t('thankYou.minutes')} {completionTime % 60} {t('thankYou.seconds')}
              </p>
            )}
          </div>

          <Button 
            onClick={onStartNew} 
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            {t('thankYou.startNew')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThankYou;
