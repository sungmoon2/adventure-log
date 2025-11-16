import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';

function App() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Supabase 연결 테스트
    const testConnection = async () => {
      try {
        const { data, error } = await supabase
          .from('places')
          .select('count')
          .limit(1);

        if (!error) {
          setConnected(true);
        }
      } catch (err) {
        console.error('Supabase connection test failed:', err);
      }
    };

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🍜 맛집 어드벤처 로그
        </h1>

        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <span className="text-gray-700">
              Supabase: {connected ? '연결됨' : '연결 중...'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-gray-700">React + TypeScript: 작동 중</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-gray-700">Tailwind CSS: 작동 중</span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-900">
            ✅ 프론트엔드 초기 설정 완료!
            <br />
            다음 단계: UI 컴포넌트 개발
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
