import "./../globals.css";
import { Manrope } from "next/font/google";
import { notFound } from "next/navigation";
import { locales } from "@/shared/i18n";
import { Providers } from "./../providers";
import { cn } from "@/lib/utils";
import { CookieConsent } from "@/shared/components/CookieConsent";
import { CustomIntlProvider } from "@/shared/components";
import { getMessages, setRequestLocale } from "next-intl/server";
import Script from "next/script";

// যদি গ্লোবাল হেডার থাকে তবে এখানে ইমপোর্ট করতে পারেন, যেমন:
// import { Header } from "@/shared/components/Header";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
});

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages({ locale });
  const direction = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={direction}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={cn(
        manrope.variable,
        "selection:bg-primary/10 selection:text-primary scroll-smooth h-full"
      )}
    >
      <body
        suppressHydrationWarning
        className="bg-background text-foreground min-h-screen font-sans antialiased flex flex-col relative"
      >
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
              var theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
              document.documentElement.classList.toggle('dark', theme === 'dark');
              document.documentElement.setAttribute('data-theme', theme);
              document.documentElement.style.colorScheme = theme;
              } catch (e) {}
            `,
          }}
        />

        <CustomIntlProvider locale={locale} messages={messages} timeZone="Asia/Dhaka">
          <Providers>
            {/* 🟢 যদি আপনার গ্লোবাল হেডার থাকে তবে তা এখানে প্লেস করুন */}
            {/* <Header /> */}

            {/* 🟢 ফিক্স: main ট্যাগ দিয়ে টপ প্যাডিং সেট করায় ব্যানার আর হেডারের নিচে ঢুকবে না */}
            <main className="flex-1 w-full">
              {children}
            </main>

            <CookieConsent />
          </Providers>
        </CustomIntlProvider>
      </body>
    </html>
  );
}