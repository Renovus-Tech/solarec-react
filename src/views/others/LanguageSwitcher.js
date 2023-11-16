import React from "react"
// import { useTranslation } from "react-i18next"
import ReactFlagsSelect from "react-flags-select"
import i18n from "../../helpers/i18n"
import { setCookie } from "src/helpers/sessionCookie";

const LanguageSwitcher = () => {

  const handleLanguageChange = (newLang) => {
    i18n.changeLanguage(newLang)
    setCookie('language',newLang)
  };

  return (
    <ReactFlagsSelect
        style={{border:'none',outline:'none'}} 
        selected={i18n.language}
        className="menu-flags"
        selectButtonClassName="menu-flags-button"
        onSelect={handleLanguageChange}
        countries={["GB", "ES", "FR", "PT"]}
        customLabels={{ GB: "", ES: "", FR: "", PT: "" }}
        placeholder=""
        showSelectedLabel={false}
        showOptionLabel={false}
        fullWidth={false}
        id="flags-select"
        rfsKey="app-lang"
        optionsSize={14}
        selectedSize={14}
    />
  );
};

export default LanguageSwitcher;