/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unknown-property */
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Plus, MessageSquare, History, Zap, Settings, LogOut } from 'lucide-react';

export const StaggeredMenu = ({
  position = 'left',
  colors = ['#2E073F', '#7A1CAC'],
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = false,
  className,
  logoUrl,
  menuButtonColor = '#EBD3F8',
  openMenuButtonColor = '#fff',
  changeMenuColorOnOpen = true,
  isFixed = false,
  accentColor = '#AD49E1',
  closeOnClickAway = true,
  onMenuOpen,
  onMenuClose,
  onNewChat
}) => {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);

  const panelRef = useRef(null);
  const preLayersRef = useRef(null);
  const preLayerElsRef = useRef([]);

  const plusHRef = useRef(null);
  const plusVRef = useRef(null);
  const iconRef = useRef(null);

  const textInnerRef = useRef(null);
  const [textLines, setTextLines] = useState(['History', 'Close']);

  const openTlRef = useRef(null);
  const closeTweenRef = useRef(null);
  const spinTweenRef = useRef(null);
  const textCycleAnimRef = useRef(null);
  const colorTweenRef = useRef(null);

  const toggleBtnRef = useRef(null);
  const busyRef = useRef(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;

      const plusH = plusHRef.current;
      const plusV = plusVRef.current;
      const icon = iconRef.current;
      const textInner = textInnerRef.current;

      if (!panel || !plusH || !plusV || !icon || !textInner) return;

      let preLayers = [];
      if (preContainer) {
        preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer'));
      }
      preLayerElsRef.current = preLayers;

      const offscreen = position === 'left' ? -100 : 100;
      gsap.set([panel, ...preLayers], { xPercent: offscreen });

      gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 });
      gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 });
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });

      gsap.set(textInner, { yPercent: 0 });

      if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    });
    return () => ctx.revert();
  }, [menuButtonColor, position]);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }

    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel'));
    const socialTitle = panel.querySelector('.sm-socials-title');
    const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link'));

    const layerStates = layers.map(el => ({ el, start: Number(gsap.getProperty(el, 'xPercent')) }));
    const panelStart = Number(gsap.getProperty(panel, 'xPercent'));

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    layerStates.forEach((ls, i) => {
      tl.fromTo(ls.el, { xPercent: ls.start }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07);
    });

    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration = 0.65;

    tl.fromTo(
      panel,
      { xPercent: panelStart },
      { xPercent: 0, duration: panelDuration, ease: 'power4.out' },
      panelInsertTime
    );

    if (itemEls.length) {
      const itemsStart = panelInsertTime + panelDuration * 0.15;
      tl.to(
        itemEls,
        { yPercent: 0, rotate: 0, duration: 1, ease: 'power4.out', stagger: { each: 0.05, from: 'start' } },
        itemsStart
      );
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;
      if (socialTitle) tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, socialsStart);
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out', stagger: { each: 0.08, from: 'start' } },
          socialsStart + 0.04
        );
      }
    }

    openTlRef.current = tl;
    return tl;
  }, [position]);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback('onComplete', () => { busyRef.current = false; });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    const all = [...layers, panel];
    closeTweenRef.current?.kill();

    const offscreen = position === 'left' ? -100 : 100;

    closeTweenRef.current = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.32,
      ease: 'power3.in',
      onComplete: () => {
        busyRef.current = false;
      }
    });
  }, [position]);

  const animateIcon = useCallback(opening => {
    const h = plusHRef.current;
    const v = plusVRef.current;
    if (!h || !v) return;

    spinTweenRef.current?.kill();

    if (opening) {
      spinTweenRef.current = gsap.timeline({ defaults: { ease: 'power4.out' } })
        .to(h, { rotate: 45, duration: 0.5 }, 0)
        .to(v, { rotate: -45, duration: 0.5 }, 0);
    } else {
      spinTweenRef.current = gsap.timeline({ defaults: { ease: 'power3.inOut' } })
        .to(h, { rotate: 0, duration: 0.35 }, 0)
        .to(v, { rotate: 90, duration: 0.35 }, 0);
    }
  }, []);

  const animateText = useCallback(opening => {
    const inner = textInnerRef.current;
    if (!inner) return;

    textCycleAnimRef.current?.kill();

    const currentLabel = opening ? 'History' : 'Close';
    const targetLabel = opening ? 'Close' : 'History';
    const seq = [currentLabel, targetLabel];

    setTextLines(seq);
    gsap.set(inner, { yPercent: 0 });

    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: -50,
      duration: 0.5,
      ease: 'power4.out'
    });
  }, []);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);

    if (target) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
    }

    animateIcon(target);
    animateText(target);
  }, [playOpen, playClose, animateIcon, animateText, onMenuOpen, onMenuClose]);

  const closeMenu = useCallback(() => {
    if (openRef.current) {
      openRef.current = false;
      setOpen(false);
      onMenuClose?.();
      playClose();
      animateIcon(false);
      animateText(false);
    }
  }, [playClose, animateIcon, animateText, onMenuClose]);

  return (
    <div className={`sm-scope ${isFixed ? 'fixed top-0 left-0 w-screen h-screen overflow-hidden' : 'w-full h-full'} z-40`}>
      <div className="staggered-menu-wrapper relative w-full h-full pointer-events-none" data-position={position}>
        <div ref={preLayersRef} className="sm-prelayers absolute top-0 left-0 bottom-0 pointer-events-none z-[5] w-full max-w-[400px]">
          {colors.map((c, i) => (
            <div key={i} className="sm-prelayer absolute top-0 left-0 h-full w-full" style={{ background: c }} />
          ))}
        </div>

        <header className="absolute top-0 left-0 w-full flex items-center justify-between p-8 z-20 pointer-events-none">
          <div className="sm-logo flex items-center select-none pointer-events-auto">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-8 w-auto object-contain" />
            ) : (
              <div className="flex items-center gap-2">
                <Zap size={24} className="text-primary fill-primary" />
                <span className="font-black text-xl text-white tracking-tighter">Explainify</span>
              </div>
            )}
          </div>

          <button
            ref={toggleBtnRef}
            className="sm-toggle inline-flex items-center gap-2 bg-transparent border-0 cursor-pointer text-[#EBD3F8] font-bold uppercase tracking-widest text-xs pointer-events-auto"
            onClick={toggleMenu}
          >
            <span className="relative inline-block h-[1em] overflow-hidden w-20">
              <span ref={textInnerRef} className="flex flex-col leading-none">
                {textLines.map((l, i) => (
                  <span className="block h-[1em] leading-none" key={i}>{l}</span>
                ))}
              </span>
            </span>
            <span ref={iconRef} className="relative w-4 h-4 flex items-center justify-center">
              <span ref={plusHRef} className="absolute w-full h-[2px] bg-primary rounded-full transition-transform" />
              <span ref={plusVRef} className="absolute w-full h-[2px] bg-primary rounded-full transition-transform" />
            </span>
          </button>
        </header>

        <aside ref={panelRef} className="staggered-menu-panel absolute top-0 left-0 h-full bg-[#1e0529]/95 backdrop-blur-xl flex flex-col p-24 pt-32 z-10 w-full max-w-[400px] pointer-events-auto border-r border-white/5 shadow-2xl overflow-hidden">
          <div className="mb-10">
            <button
              onClick={() => { onNewChat?.(); closeMenu(); }}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary rounded-[2rem] text-white font-black uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(122,28,172,0.5)] hover:scale-105 active:scale-95 transition-all"
            >
              <Plus size={18} />
              <span>New Thread</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <div className="flex items-center gap-2 mb-4 px-2">
              <History size={14} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Neural History</span>
            </div>
            
            <ul className="flex flex-col gap-3 list-none p-0 m-0">
              {items.length ? items.map((it, idx) => (
                <li key={idx} className="sm-panel-itemWrap">
                  <a
                    href={it.link}
                    className="group flex flex-col gap-1 p-4 rounded-3xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all no-underline"
                    onClick={closeMenu}
                  >
                    <span className="sm-panel-itemLabel text-white font-bold text-sm tracking-tight group-hover:text-primary transition-colors truncate">
                      {it.label}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">{it.date || 'Just now'}</span>
                  </a>
                </li>
              )) : (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
                  <MessageSquare size={40} className="mb-4 text-primary" />
                  <p className="text-xs font-bold text-white uppercase tracking-widest leading-relaxed">No threads found in<br/>neural core</p>
                </div>
              )}
            </ul>
          </div>

          <div className="mt-auto pt-8 border-t border-white/5 flex flex-col gap-4">
             <div className="flex items-center gap-4 p-4 rounded-3xl bg-white/5 border border-white/5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary/40 to-secondary/40 flex items-center justify-center border border-white/10">
                   <span className="font-black text-xs text-white">?</span>
                </div>
                <div className="flex-1 truncate">
                  <p className="text-xs font-black text-white truncate">User Session</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Neural Pro</p>
                </div>
             </div>
             <button className="flex items-center gap-3 p-4 text-gray-500 hover:text-white transition-colors">
                <Settings size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">Settings</span>
             </button>
             <button className="flex items-center gap-3 p-4 text-red-400 hover:text-red-300 transition-colors">
                <LogOut size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">Terminate Session</span>
             </button>
          </div>
        </aside>
      </div>

      <style>{`
        .sm-scope .sm-panel-itemLabel { display: inline-block; will-change: transform; transform-origin: 50% 100%; }
        .sm-scope .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .sm-scope .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .sm-scope .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(122, 28, 172, 0.2); border-radius: 10px; }
        .sm-scope .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(122, 28, 172, 0.5); }
      `}</style>
    </div>
  );
};

export default StaggeredMenu;
