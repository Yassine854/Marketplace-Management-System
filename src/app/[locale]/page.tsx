import { unstable_setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";

type Locale = "en" | "fr";
type PageParamsType = {
  params: {
    locale: Locale;
  };
};

const HomePage = ({ params: { locale } }: PageParamsType) => {
  // Ensures static rendering at build time.
  unstable_setRequestLocale(locale);

  const t = useTranslations();

  return (
    <div className="flex flex-grow items-center justify-center bg-red-700">
      <p className="text-red text-4xl "> {t("TITLE")}</p>
    </div>
  );
};
export default HomePage;
