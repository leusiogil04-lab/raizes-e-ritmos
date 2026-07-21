"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "motion/react"
import { projectConfig } from "@/lib/site-config"

export function Hero() {
  const ref = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  // Movimento suave da imagem durante o scroll
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const { hero } = projectConfig

  return (
    <section
      id="top"
      ref={ref}
      className="
        relative
        flex
        min-h-svh
        items-center
        justify-center
        overflow-hidden
        bg-wine
        text-cream
      "
    >
      {/* =========================================================
          IMAGEM / VÍDEO DE FUNDO
      ========================================================= */}

      <motion.div
        style={{ y, scale }}
        className="absolute inset-0"
      >
        {hero.videoUrl ? (
          <video
            className="h-full w-full object-cover"
            src={hero.videoUrl}
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <Image
            src={hero.media || "/placeholder.svg"}
            alt="Vivência musical de Moçambique"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        )}

        {/* Camada escura para melhorar a leitura do texto */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-b
            from-wine/75
            via-wine/55
            to-wine/95
          "
        />
      </motion.div>

      {/* =========================================================
          ONDAS SONORAS
      ========================================================= */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          right-0
          z-[1]
          flex
          h-28
          items-end
          justify-center
          gap-1
          opacity-35
          md:h-36
          md:gap-1.5
        "
      >
        {Array.from({ length: 48 }).map((_, i) => (
          <motion.span
            key={i}
            className="
              w-1
              rounded-full
              bg-accent
              md:w-1.5
            "
            initial={{ height: 6 }}
            animate={{
              height: [6, 18 + (i % 7) * 10, 6],
            }}
            transition={{
              duration: 1.2 + (i % 5) * 0.25,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: i * 0.04,
            }}
          />
        ))}
      </div>

      {/* =========================================================
          CONTEÚDO PRINCIPAL
      ========================================================= */}

      <motion.div
        style={{ opacity }}
        className="
          relative
          z-10
          mx-auto
          flex
          w-full
          max-w-6xl
          flex-col
          items-center
          px-5
          pb-20
          pt-28
          text-center
          sm:px-8
          md:pb-24
          md:pt-32
        "
      >
        {/* =====================================================
            TEXTO DE APOIO
        ===================================================== */}

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.3,
          }}
          className="
            mb-5
            max-w-full
            text-[10px]
            font-semibold
            uppercase
            tracking-[0.28em]
            text-accent
            sm:text-xs
            sm:tracking-[0.35em]
          "
        >
          {hero.eyebrow}
        </motion.p>

        {/* =====================================================
            TÍTULO PRINCIPAL

            O tamanho foi reduzido para evitar que o título
            ocupe a tela inteira.

            Mobile: 18vw → 14vw
            Tablet: 6rem
            Desktop: 8rem
        ===================================================== */}

        <h1
          className="
            w-full
            max-w-5xl
            font-serif
            text-[14vw]
            font-semibold
            leading-[0.88]
            tracking-[-0.035em]
            sm:text-7xl
            md:text-8xl
            lg:text-[8rem]
            xl:text-[9rem]
          "
        >
          {hero.titleLines.map((line, i) => (
            <motion.span
              key={line + i}
              className={`
                block
                ${
                  i === 1
                    ? "italic text-accent"
                    : "text-cream"
                }
              `}
              initial={{
                opacity: 0,
                y: 40,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                delay: 0.4 + i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {line}
            </motion.span>
          ))}
        </h1>

        {/* =====================================================
            SUBTÍTULO
        ===================================================== */}

        <motion.p
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            delay: 0.85,
          }}
          className="
            mx-auto
            mt-6
            max-w-xl
            text-pretty
            text-sm
            leading-relaxed
            text-cream/85
            sm:mt-7
            sm:text-base
            md:text-lg
          "
        >
          {hero.subtitle}
        </motion.p>

        {/* =====================================================
            NOME DO FACILITADOR
        ===================================================== */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.8,
            delay: 1,
          }}
          className="
            mt-4
            text-xs
            text-cream/70
            sm:text-sm
          "
        >
          <span className="font-semibold text-cream">
            {hero.withText}
          </span>

          {" — "}

          {hero.withSubtext}
        </motion.div>

        {/* =====================================================
            BOTÕES
        ===================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
            delay: 1.1,
          }}
          className="
            mt-8
            flex
            w-full
            flex-col
            items-center
            justify-center
            gap-3
            sm:mt-9
            sm:w-auto
            sm:flex-row
          "
        >
          {/* Botão principal */}
          <a
            href="#eventos"
            className="
              w-full
              rounded-full
              bg-accent
              px-7
              py-3.5
              text-xs
              font-semibold
              uppercase
              tracking-wide
              text-wine
              transition-all
              duration-300
              hover:scale-105
              hover:shadow-lg
              sm:w-auto
              sm:px-8
              sm:py-4
              sm:text-sm
            "
          >
            {hero.primaryCta}
          </a>

          {/* Botão secundário */}
          <a
            href="#experiencia"
            className="
              w-full
              rounded-full
              border
              border-cream/40
              px-7
              py-3.5
              text-xs
              font-semibold
              uppercase
              tracking-wide
              text-cream
              transition-all
              duration-300
              hover:border-cream
              hover:bg-cream/10
              sm:w-auto
              sm:px-8
              sm:py-4
              sm:text-sm
            "
          >
            {hero.secondaryCta}
          </a>
        </motion.div>
      </motion.div>

      {/* =========================================================
          INDICADOR DE SCROLL
      ========================================================= */}

      <motion.div
        style={{ opacity }}
        className="
          absolute
          bottom-5
          left-1/2
          z-10
          hidden
          -translate-x-1/2
          sm:block
        "
      >
        <motion.div
          animate={{
            y: [0, 8, 0],
          }}
          transition={{
            duration: 1.6,
            repeat: Number.POSITIVE_INFINITY,
          }}
          className="
            flex
            flex-col
            items-center
            gap-2
            text-[0.6rem]
            font-semibold
            uppercase
            tracking-[0.3em]
            text-cream/60
          "
        >
          {hero.scrollHint}

          <span className="h-7 w-px bg-cream/40" />
        </motion.div>
      </motion.div>
    </section>
  )
}