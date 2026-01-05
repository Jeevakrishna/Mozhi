import { useState } from 'react';
import { PlayIcon, BookOpenIcon, AcademicCapIcon, UserGroupIcon, LightBulbIcon, HeartIcon } from '@heroicons/react/24/outline';
import TanglishCompiler from './TanglishCompiler';

const LandingPage = () => {
  const [showPlayground, setShowPlayground] = useState(false);

  if (showPlayground) {
    return <TanglishCompiler />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F5F0] via-yellow-50 to-[#F5F5F0] kolam-bg">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="floating">
            <div className="w-20 h-20 bg-[#800020] rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-white font-bold text-4xl">த</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-[#3D2B1F] mb-6 font-display">
            <span className="tamil-highlight">Think in Tamil.</span>
            <br />
            <span className="tamil-highlight">Code in Tanglish.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-[#3D2B1F]/80 mb-8 max-w-3xl mx-auto">
            Learn programming using Tamil words written in English letters — for kids, students, teachers, and lifelong learners.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setShowPlayground(true)}
              className="px-8 py-4 bg-[#F4C430] text-[#3D2B1F] rounded-lg hover:bg-[#F7DC6F] transition-all transform hover:scale-105 flex items-center justify-center space-x-2 font-semibold"
            >
              <PlayIcon className="w-6 h-6" />
              <span>🧪 Try Tanglish Playground</span>
            </button>
            
            <button className="px-8 py-4 bg-[#800020] text-white rounded-lg hover:bg-[#8B0A1A] transition-all transform hover:scale-105 flex items-center justify-center space-x-2 font-semibold">
              <BookOpenIcon className="w-6 h-6" />
              <span>📘 Read User Manual</span>
            </button>
          </div>
        </div>
      </header>

      {/* What is Tanglish Section */}
      <section className="py-16 bg-white/80 backdrop-blur">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-[#3D2B1F] mb-12">What is Tanglish?</h2>
          
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-[#3D2B1F]/80 mb-8 text-center">
              Tanglish lets users write programs using Tamil words written in English letters, making programming accessible to Tamil speakers.
            </p>
            
            <div className="bg-[#F4C430]/20 rounded-lg p-6 mb-8">
              <pre className="text-sm md:text-base text-[#3D2B1F] font-mono">
{`vaippu age = 10
endraal age > 5 {
    kaattu "Super!"
}`}
              </pre>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="font-semibold text-[#3D2B1F] mb-2">No English Grammar Barrier</h3>
                <p className="text-[#3D2B1F]/70">Use familiar Tamil words to learn programming concepts</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="font-semibold text-[#3D2B1F] mb-2">Designed for Beginners</h3>
                <p className="text-[#3D2B1F]/70">Simple syntax that focuses on logic, not language complexity</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="font-semibold text-[#3D2B1F] mb-2">Runs in Browser</h3>
                <p className="text-[#3D2B1F]/70">No installation needed - start coding immediately</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Language Keywords Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-[#3D2B1F] mb-12">Language Keywords</h2>
          
          <div className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-lg">
              <thead className="bg-[#800020] text-white">
                <tr>
                  <th className="px-6 py-3 text-left">Tanglish</th>
                  <th className="px-6 py-3 text-left">Meaning</th>
                  <th className="px-6 py-3 text-left">Tamil</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4C430]/20">
                <tr className="hover:bg-[#F4C430]/10 transition-colors">
                  <td className="px-6 py-3 font-mono text-[#3D2B1F]">vaippu</td>
                  <td className="px-6 py-3 text-[#3D2B1F]">Variable</td>
                  <td className="px-6 py-3 text-[#3D2B1F]">வைப்பு</td>
                </tr>
                <tr className="hover:bg-[#F4C430]/10 transition-colors">
                  <td className="px-6 py-3 font-mono text-[#3D2B1F]">ennam</td>
                  <td className="px-6 py-3 text-[#3D2B1F]">Number</td>
                  <td className="px-6 py-3 text-[#3D2B1F]">எண்ணம்</td>
                </tr>
                <tr className="hover:bg-[#F4C430]/10 transition-colors">
                  <td className="px-6 py-3 font-mono text-[#3D2B1F]">ezhuthu</td>
                  <td className="px-6 py-3 text-[#3D2B1F]">String</td>
                  <td className="px-6 py-3 text-[#3D2B1F]">எழுத்து</td>
                </tr>
                <tr className="hover:bg-[#F4C430]/10 transition-colors">
                  <td className="px-6 py-3 font-mono text-[#3D2B1F]">unmai_poi</td>
                  <td className="px-6 py-3 text-[#3D2B1F]">Boolean</td>
                  <td className="px-6 py-3 text-[#3D2B1F]">உண்மை பொய்</td>
                </tr>
                <tr className="hover:bg-[#F4C430]/10 transition-colors">
                  <td className="px-6 py-3 font-mono text-[#3D2B1F]">endraal</td>
                  <td className="px-6 py-3 text-[#3D2B1F]">If</td>
                  <td className="px-6 py-3 text-[#3D2B1F]">என்றால்</td>
                </tr>
                <tr className="hover:bg-[#F4C430]/10 transition-colors">
                  <td className="px-6 py-3 font-mono text-[#3D2B1F]">illai</td>
                  <td className="px-6 py-3 text-[#3D2B1F]">Else</td>
                  <td className="px-6 py-3 text-[#3D2B1F]">இல்லை</td>
                </tr>
                <tr className="hover:bg-[#F4C430]/10 transition-colors">
                  <td className="px-6 py-3 font-mono text-[#3D2B1F]">seyal</td>
                  <td className="px-6 py-3 text-[#3D2B1F]">Function</td>
                  <td className="px-6 py-3 text-[#3D2B1F]">செயல்</td>
                </tr>
                <tr className="hover:bg-[#F4C430]/10 transition-colors">
                  <td className="px-6 py-3 font-mono text-[#3D2B1F]">thirumba</td>
                  <td className="px-6 py-3 text-[#3D2B1F]">While</td>
                  <td className="px-6 py-3 text-[#3D2B1F]">திரும்ப</td>
                </tr>
                <tr className="hover:bg-[#F4C430]/10 transition-colors">
                  <td className="px-6 py-3 font-mono text-[#3D2B1F]">foru</td>
                  <td className="px-6 py-3 text-[#3D2B1F]">For</td>
                  <td className="px-6 py-3 text-[#3D2B1F]">ஃபோர்</td>
                </tr>
                <tr className="hover:bg-[#F4C430]/10 transition-colors">
                  <td className="px-6 py-3 font-mono text-[#3D2B1F]">agarathi</td>
                  <td className="px-6 py-3 text-[#3D2B1F]">Dictionary</td>
                  <td className="px-6 py-3 text-[#3D2B1F]">அகராதி</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Learning Path Section */}
      <section className="py-16 bg-white/80 backdrop-blur">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-[#3D2B1F] mb-12">Learning Path</h2>
          
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-gradient-to-br from-[#F4C430] to-yellow-300 rounded-lg p-6 text-center transform hover:scale-105 transition-all">
                <div className="text-3xl mb-3">🪁</div>
                <h3 className="font-bold text-[#3D2B1F] mb-2">Kolam Level</h3>
                <p className="text-sm text-[#3D2B1F]/80">Print & Variables</p>
              </div>
              
              <div className="bg-gradient-to-br from-[#228B22] to-green-400 rounded-lg p-6 text-center transform hover:scale-105 transition-all">
                <div className="text-3xl mb-3">🏏</div>
                <h3 className="font-bold text-white mb-2">Goli Level</h3>
                <p className="text-sm text-white/80">Math & Conditions</p>
              </div>
              
              <div className="bg-gradient-to-br from-[#800020] to-red-700 rounded-lg p-6 text-center transform hover:scale-105 transition-all">
                <div className="text-3xl mb-3">🪀</div>
                <h3 className="font-bold text-white mb-2">Top Level</h3>
                <p className="text-sm text-white/80">Loops</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg p-6 text-center transform hover:scale-105 transition-all">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-bold text-white mb-2">Kabaddi Level</h3>
                <p className="text-sm text-white/80">Functions</p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg p-6 text-center transform hover:scale-105 transition-all">
                <div className="text-3xl mb-3">🛕</div>
                <h3 className="font-bold text-white mb-2">Guru Level</h3>
                <p className="text-sm text-white/80">Data Structures</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Is This For Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-[#3D2B1F] mb-12">Who Is This For?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-white rounded-lg p-8 shadow-lg text-center transform hover:scale-105 transition-all">
              <div className="text-4xl mb-4">👦</div>
              <h3 className="font-bold text-[#3D2B1F] mb-2">Kids (8+)</h3>
              <p className="text-[#3D2B1F]/70">Start coding with familiar Tamil words</p>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-lg text-center transform hover:scale-105 transition-all">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="font-bold text-[#3D2B1F] mb-2">Students</h3>
              <p className="text-[#3D2B1F]/70">Learn programming concepts in your mother tongue</p>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-lg text-center transform hover:scale-105 transition-all">
              <div className="text-4xl mb-4">👩‍🏫</div>
              <h3 className="font-bold text-[#3D2B1F] mb-2">Teachers</h3>
              <p className="text-[#3D2B1F]/70">Teach coding without language barriers</p>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-lg text-center transform hover:scale-105 transition-all">
              <div className="text-4xl mb-4">👴</div>
              <h3 className="font-bold text-[#3D2B1F] mb-2">Elders</h3>
              <p className="text-[#3D2B1F]/70">Learn programming at your own pace</p>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-lg text-center transform hover:scale-105 transition-all">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="font-bold text-[#3D2B1F] mb-2">First-time Coders</h3>
              <p className="text-[#3D2B1F]/70">Gentle introduction to programming</p>
            </div>
            
            <div className="bg-white rounded-lg p-8 shadow-lg text-center transform hover:scale-105 transition-all">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="font-bold text-[#3D2B1F] mb-2">Tamil Community</h3>
              <p className="text-[#3D2B1F]/70">Preserve our language in tech</p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 bg-white/80 backdrop-blur">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-[#3D2B1F] mb-12">Our Philosophy</h2>
          
          <div className="max-w-4xl mx-auto text-center">
            <div className="space-y-6 text-lg text-[#3D2B1F]/80">
              <p>
                Tanglish is <strong>not replacing Tamil</strong> - it's a bridge to programming that uses familiar Tamil words written in English letters.
              </p>
              
              <p>
                We believe <strong>thinking logically</strong> is more important than perfect English grammar when learning to code.
              </p>
              
              <p>
                <strong>Language barriers should not block creativity</strong> - everyone deserves the chance to learn programming, regardless of their English proficiency.
              </p>
            </div>
            
            <blockquote className="mt-12 p-6 bg-[#F4C430]/20 rounded-lg">
              <p className="text-2xl font-bold text-[#3D2B1F] italic">
                "மொழி தடையல்ல; சிந்தனை முக்கியம்."
              </p>
              <p className="text-[#3D2B1F]/70 mt-2">"Language is not a barrier; thinking is important."</p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#800020] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <HeartIcon className="w-5 h-5" />
              <span>Made with ❤️ in Tamil Nadu</span>
            </div>
            
            <div className="flex flex-wrap justify-center space-x-6 mb-6">
              <button 
                onClick={() => setShowPlayground(true)}
                className="hover:text-[#F4C430] transition-colors"
              >
                Playground
              </button>
              <a href="#" className="hover:text-[#F4C430] transition-colors">User Manual</a>
              <a href="#" className="hover:text-[#F4C430] transition-colors">GitHub</a>
              <a href="#" className="hover:text-[#F4C430] transition-colors">Contribute</a>
            </div>
            
            <p className="text-[#F4C430]/80">
              வணக்கம் மீண்டும் சந்திப்போம்
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
