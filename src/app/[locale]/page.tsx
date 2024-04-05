import { useTranslations } from "next-intl";
import { Metadata } from "next";
import Switcher from "../../components/LanguageSwitcher";

type Locale = "en" | "fr";
type PageParamsType = {
  params: {
    locale: Locale;
  };
};
export const metadata: Metadata = {
  title: "Next.js App Router i18n localization",
};

const HomePage = ({ params: { locale } }: PageParamsType) => {
  console.log("🚀 ~ HomePage ~ locale:", locale);
  const t = useTranslations();

  return (
    <div>
      <h1>{t("TITLE")}</h1>

      <Switcher />
    </div>
  );
};

export default HomePage;
