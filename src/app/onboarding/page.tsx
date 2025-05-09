"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  LineChart,
  Shield,
  Sparkles,
  User,
} from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const totalSteps = 4;

  // global state
  const [step, setStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [experience, setExperience] = useState<
    "beginner" | "intermediate" | "advanced"
  >();
  const [loading, setLoading] = useState(false);

  // Step 1 typing state
  const fullText = "Hi, I’m aibo. You do the living. I’ll handle the rest.";
  const [displayed, setDisplayed] = useState("");
  const typingRef = useRef<number[]>([]);

  // options for Step 2
  const options = [
    {
      id: "full-autopilot",
      title: "Full Autopilot",
      desc: "aibo tracks and logs all trades, suggests rebalancing, alerts you to key market moves, and nudges you when you repeat past trading errors",
      icon: <Bot className="h-6 w-6 text-cyan-400" />,
    },
    {
      id: "partial-autopilot",
      title: "Partial Autopilot",
      desc: "aibo monitors and advises, but never suggests or acts unless prompted",
      icon: <Shield className="h-6 w-6 text-cyan-400" />,
    },
    {
      id: "advisor-mode",
      title: "Advisor Mode",
      desc: "aibo gives daily and weekly trading summaries, but stays fully observational",
      icon: <LineChart className="h-6 w-6 text-cyan-400" />,
    },
  ];

  // go next/back
  const next = () => setStep((s) => Math.min(totalSteps, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  // Step 1: auto-type
  useEffect(() => {
    if (step !== 1) return;
    setDisplayed("");
    // clear old timers
    typingRef.current.forEach((t) => clearTimeout(t));
    typingRef.current = [];

    // schedule typing
    for (let i = 0; i < fullText.length; i++) {
      const t = window.setTimeout(() => {
        setDisplayed((d) => d + fullText[i]);
      }, i * 50); // 50ms per char
      typingRef.current.push(t);
    }
    // cleanup on unmount/step change
    return () => typingRef.current.forEach((t) => clearTimeout(t));
  }, [step]);

  // final finish
  async function finish() {
    setLoading(true);
    const res = await fetch("/api/complete-onboarding", {
      method: "POST",
      credentials: "include",
    });
    if (res.ok) {
      router.replace("/dashboard");
    } else {
      console.error("complete-onboarding failed:", await res.text());
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen h-full bg-black flex items-center justify-center p-8">
      <div
        className={`w-full max-w-3xl border border-white/10 rounded-xl shadow-xl overflow-hidden ${
          step === 1 && "max-w-sm"
        }`}
      >
        {/* Progress */}
        {step > 1 && (
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div key={i} className="flex items-center">
                  <div
                    className={[
                      "flex items-center justify-center w-8 h-8 rounded-full",
                      step > i + 1
                        ? "text-white border-white/10 border"
                        : step === i + 1
                        ? "text-black bg-[#7BE9EC]"
                        : "text-white border-white/10 border",
                    ].join(" ")}
                  >
                    {step > i + 1 ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  {i < totalSteps - 1 && (
                    <div
                      className={`flex-1 h-1 ml-2 ${
                        step > i + 1 ? "bg-green-500" : "bg-gray-800"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ► Step 1 */}
        {/* Step 1 */}
        {step === 1 && (
          <>
            <div className="px-6 pb-6 text-center space-y-6">
              {/* 1) Relative wrapper */}
              <div className="relative inline-block">
                {/* 2) Bigger image */}
                <div className="relative w-[350px] h-auto">
                  <div
                    className="
                      relative 
                      text-white
                      text-md font-bold
                      font-mono
                      p-4 
                    "
                  >
                    <p>
                      {displayed}
                      <span className="inline-block w-1 h-3 bg-white/30 mt-1 animate-pulse ml-1" />
                    </p>
                  </div>
                  <div className="border border-white/10 rounded-lg overflow-hidden">
                    <video
                      src="/assets/videos/hello-video.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-auto rounded-lg"
                    />
                    <div className="absolute bottom-0 left-0  w-full h-20 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* 4) Continue button */}
            <div className="px-6 pb-6">
              <button
                onClick={next}
                disabled={displayed !== fullText}
                className={`
                  w-full py-2 rounded-lg font-medium transition cursor-pointer flex items-center justify-center gap-1 
                  ${
                    displayed === fullText
                      ? "bg-[#7BE9EC] text-black cursor-pointer"
                      : "border text-white border-white/10 rrounded-xl cursor-not-allowed"
                  }
                `}
              >
                Let`s go!
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {/* ► Step 2 */}
        {step === 2 && (
          <>
            <div className="px-6 py-6">
              <h3 className="text-xl font-bold text-white mb-2">
                Choose your aibo mode
              </h3>
              <p className="text-gray-400 mb-4">
                Select how you want aibo to assist with your trading
              </p>
              <div className="space-y-3">
                {options.map((o) => {
                  const active = selectedOption === o.id;
                  return (
                    <div
                      key={o.id}
                      onClick={() => setSelectedOption(o.id)}
                      className={[
                        "flex items-start p-4 border rounded-lg cursor-pointer transition",
                        active
                          ? "border-[#7BE9EC] bg-gray-800"
                          : "border-white/10 hover:border-gray-600",
                      ].join(" ")}
                    >
                      <div className="mt-1">{o.icon}</div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-medium ${
                              active ? "text-white" : "text-gray-300"
                            }`}
                          >
                            {o.title}
                          </span>
                          {active && (
                            <span className="inline-flex items-center justify-center w-5 h-5 bg-[#7BE9EC] text-black rounded-full">
                              <Check className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-gray-400 text-sm capitalize">
                          {o.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="px-6 pb-6 flex justify-between">
              <button
                onClick={back}
                className="inline-flex items-center px-4 py-2 border border-white/10 rounded-lg text-gray-400 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
              <button
                onClick={next}
                disabled={!selectedOption}
                className={`
                  inline-flex items-center px-4 py-2 rounded-lg font-medium transition
                  ${
                    selectedOption
                      ? "bg-[#7BE9EC] text-black hover:bg-cyan-300"
                      : "bg-gray-800 text-gray-600 cursor-not-allowed"
                  }
                `}
              >
                Next
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {/* ► Step 3 */}
        {step === 3 && (
          <>
            <div className="px-6 py-6 space-y-4">
              <h3 className="text-xl font-bold text-white">
                Personalize your experience
              </h3>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-400 mb-1"
                >
                  Your name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-600" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-transparent border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-cyan-400 focus:border-cyan-400"
                    placeholder="Enter your name"
                  />
                </div>
              </div>
              <div>
                <p className="block text-sm font-medium text-gray-400 mb-1">
                  Trading experience
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {(["beginner", "intermediate", "advanced"] as const).map(
                    (lvl) => {
                      const active = experience === lvl;
                      return (
                        <div
                          key={lvl}
                          onClick={() => setExperience(lvl)}
                          className={[
                            "text-center py-2 border rounded-lg cursor-pointer transition",
                            active
                              ? "border-[#7BE9EC] bg-gray-800"
                              : "border-gray-700 hover:border-gray-600",
                          ].join(" ")}
                        >
                          <input
                            type="radio"
                            name="experience"
                            className="sr-only"
                            checked={active}
                            readOnly
                          />
                          <span
                            className={`capitalize ${
                              active ? "text-white" : "text-gray-300"
                            }`}
                          >
                            {lvl}
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
            <div className="px-6 pb-6 flex justify-between">
              <button
                onClick={back}
                className="inline-flex items-center px-4 py-2 border border-gray-700 rounded-lg text-gray-400 hover:bg-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </button>
              <button
                onClick={next}
                disabled={!name || !experience}
                className={`
                  inline-flex items-center px-4 py-2 rounded-lg font-medium transition
                  ${
                    name && experience
                      ? "bg-cyan-400 text-black hover:bg-cyan-300"
                      : "bg-gray-800 text-gray-600 cursor-not-allowed"
                  }
                `}
              >
                Next <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {/* ► Step 4 */}
        {step === 4 && (
          <>
            <div className="px-6 py-6 text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-700 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">You`re all set!</h2>
              <p className="text-gray-400">
                Your aibo is ready to assist you with your trading journey
              </p>
            </div>
            <div className="px-6">
              <div className="p-4 rounded-lg border border-white/10 mb-4">
                <h3 className="font-medium text-white mb-2">
                  Your configuration
                </h3>
                <div className="text-sm text-gray-300 space-y-1">
                  <div className="flex justify-between">
                    <span>Mode:</span>
                    <span className="font-medium">
                      {options.find((o) => o.id === selectedOption)?.title}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Name:</span>
                    <span className="font-medium">{name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Experience:</span>
                    <span className="font-medium capitalize">{experience}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 pb-6 flex justify-between">
              <button
                onClick={back}
                className="inline-flex items-center px-4 py-2 border border-gray-700 rounded-lg text-gray-400 hover:bg-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </button>
              <button
                onClick={finish}
                disabled={loading}
                className={`
                  inline-flex items-center px-4 py-2 rounded-lg font-medium transition
                  ${
                    loading
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }
                `}
              >
                {loading ? "Saving…" : "Get Started"}{" "}
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
