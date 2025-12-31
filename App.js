// src/App.js
import React, { useState, useEffect, useMemo } from "react";
import "./App.css";
import MapImporter from "./components/MapImporter";
import ZonePlacer from "./components/ZonePlacer";
import OptimizationPanel from "./components/OptimizationPanel";
import RobotHelper from "./components/RobotHelper";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import ReportGenerator from "./components/ReportGenerator";

const translations = {
  fr: {
    title: "Smart Warehouse Layout Optimizer",
    subtitle:
      "Optimisez vos layouts d'entrepôt, les trajets de picking et la performance globale.",
    menuLayout: "Carte & Zones",
    menuOpti: "Optimisation",
    menuDashboard: "Dashboard",
    menuReports: "Rapports",
    menuSettings: "Paramètres",
    btnLoad: "Charger",
    btnReset: "Réinitialiser",
    btnSave: "Sauvegarder",
    footer: "Prototype Smart Warehouse",
    settingsTitle: "Paramètres avancés",
    settingsSubtitle:
      "Centre de contrôle pour la langue, le thème, les formats et l’adaptation pays.",
    settingsAppTitle: "Application",
    settingsAppDesc:
      "Configuration globale de la langue et du comportement de l’interface.",
    settingsDisplayTitle: "Affichage",
    settingsDisplayDesc:
      "Personnalisez le thème visuel pour l’ensemble de l’application.",
    settingsLocTitle: "Localisation & formats",
    settingsLocDesc:
      "Adaptez les formats aux habitudes du pays de votre client.",
  },
  en: {
    title: "Smart Warehouse Layout Optimizer",
    subtitle:
      "Optimize warehouse layouts, picking routes and overall performance.",
    menuLayout: "Layout & Zones",
    menuOpti: "Optimization",
    menuDashboard: "Dashboard",
    menuReports: "Reports",
    menuSettings: "Settings",
    btnLoad: "Load",
    btnReset: "Reset",
    btnSave: "Save",
    footer: "Smart Warehouse Prototype",
    settingsTitle: "Advanced settings",
    settingsSubtitle:
      "Control center for language, theme, formats and country adaptation.",
    settingsAppTitle: "Application",
    settingsAppDesc:
      "Global configuration of language and interface behavior.",
    settingsDisplayTitle: "Display",
    settingsDisplayDesc:
      "Customize the visual theme across the whole application.",
    settingsLocTitle: "Localization & formats",
    settingsLocDesc:
      "Adjust formats to your customer’s country conventions.",
  },
  ar: {
    title: "منظّم تخطيط المستودع",
    subtitle:
      "حسّن مخططات المستودع ومسارات الانتقاء والأداء العام.",
    menuLayout: "الخريطة والمناطق",
    menuOpti: "التحسين",
    menuDashboard: "لوحة المؤشرات",
    menuReports: "التقارير",
    menuSettings: "الإعدادات",
    btnLoad: "تحميل",
    btnReset: "إعادة تعيين",
    btnSave: "حفظ",
    footer: "نموذج أولي لمستودع ذكي",
    settingsTitle: "إعدادات متقدمة",
    settingsSubtitle:
      "مركز التحكم للغة و المظهر وتنسيقات البلد.",
    settingsAppTitle: "التطبيق",
    settingsAppDesc:
      "إعدادات عامة للغة وسلوك واجهة الاستخدام.",
    settingsDisplayTitle: "العرض",
    settingsDisplayDesc:
      "تخصيص نمط المظهر في كامل التطبيق.",
    settingsLocTitle: "الموقع والتنسيقات",
    settingsLocDesc:
      "تكييف التنسيقات حسب بلد العميل.",
  },
  amazigh: {
    title: "ⵜⴰⵎⴰⵣⵉⵖⵜ Smart Warehouse Layout Optimizer",
    subtitle:
      "ⵙⵓⵎⵔⴰ ⵏ ⵓⵎⵔⴰⵔ ⵏ ⵍⵎⵙⴰⵏ، ⵉⵎⵙⵏ ⵏ ⵍⵉⵙⵏⵎⵉⵔ ⵏ ⵜⵉⵎⵙⵎⵉⵔ ⴷ ⵜⵉⵎⵣⴰⵣⵉⵖⵉⵏ.",
    menuLayout: "ⵜⴰⵎⴰⵖⵉⵍⵜ ⴷ ⵣⵓⵏⵙ",
    menuOpti: "ⵜⵉⵎⵣⴰⵣⵉⵖⵜ",
    menuDashboard: "ⵜⵉⵣⵣⵓⵔⵜ",
    menuReports: "ⵜⵉⵙⵙⵎⴰⵔⵉⵡⵉⵏ",
    menuSettings: "ⵜⵉⵙⵔⵉⵎⵉⵏ",
    btnLoad: "ⵜⴰⵡⵍⴰⵢ",
    btnReset: "ⴰⵔⵉ ⵍⴰⵎⵎⴰⵢ",
    btnSave: "ⵃⴻⴼⴷ",
    footer: "ⵜⴰⵎⴰⵣⵉⵖⵜ ⵏ ⵍⵎⵙⴰⵏ ⵎⵓⵔⴳⴰⵔ",
    settingsTitle: "ⵜⵉⵙⵔⵉⵎⵉⵏ ⵏ ⵜⴰⵎⵢⴰⵣⵉⵖⵜ",
    settingsSubtitle:
      "ⴰⵎⵎⵓⵙ ⵏ ⵓⵔⵣⵓⵣ ⵏ ⵜⵍⵍⵉⵍⵉⵏ, ⵜⵉⵎⴰⵣⵉⵖⵜ ⴷ ⵜⵉⵙⵔⵉⵎⵉⵏ ⵏ ⵍⵇⵇⴰⵢⴰ.",
    settingsAppTitle: "ⵜⴰⵍⵍⵉⵍⵜ",
    settingsAppDesc:
      "ⵜⵉⵙⵔⵉⵎⵉⵏ ⵏ ⵜⵍⵍⵉⵍⵉⵏ ⴷ ⵡⴰⵏⵓⵔ ⵏ ⵜⵡⵉⵍⵉ.",
    settingsDisplayTitle: "ⵜⵉⵜⵜⵓⵔⵉ",
    settingsDisplayDesc:
      "ⵜⵉⵜⵜⵓⵔⵉ ⵏ ⵜⵉⵎⴰⵣⵉⵖⵜ ⴰⵙⵏⵓⴳⵎⴰⵙ ⵏ ⵜⴰⵍⵍⵉⵍⵜ.",
    settingsLocTitle: "ⵜⵉⵍⵍⴰⵢⵜ ⴷ ⵜⵉⵙⵔⵉⵎⵉⵏ",
    settingsLocDesc:
      "ⵜⴽⵔⵙⵉⵎ ⵜⵉⵙⵔⵉⵎⵉⵏ ⵉⵎⴰⵙⵉⵏ ⵏ ⵍⵇⵇⴰⵢⴰ.",
  },
};

function App() {
  // Carte et zones
  const [mapUrl, setMapUrl] = useState(null);
  const [zones, setZones] = useState([]);

  // Toast global
  const [toast, setToast] = useState(null);

  // Métriques du layout courant
  const [beforeMetrics, setBeforeMetrics] = useState(null);
  const [afterMetrics, setAfterMetrics] = useState(null);
  const [strategy, setStrategy] = useState("balanced");

  // Vue active
  const [activeView, setActiveView] = useState("layout");

  // Paramètres généraux
  const [settingsGeneral, setSettingsGeneral] = useState({
    language: "fr",
    theme: "light",
    timezone: "Europe/Paris",
    currency: "EUR",
    distanceUnit: "m",
    areaUnit: "m2",
    dateFormat: "DD/MM/YYYY",
  });

  // Scénarios
  const [scenarios, setScenarios] = useState([]);
  const [activeScenarioId, setActiveScenarioId] = useState(null);

  // Baseline globale
  const [baselineZones, setBaselineZones] = useState(null);
  const [baselineMetrics, setBaselineMetrics] = useState(null);
  const [baselineName, setBaselineName] = useState("Aucune baseline");

  // Infos rapport
  const warehouseName = "Entrepôt Principal";
  const userName = "Nassira FAHFOUHI";
  const layoutImage = null;
  const optimizedLayoutImage = null;

  // dictionnaire courant en fonction de la langue
  const t =
    translations[settingsGeneral.language] || translations.fr;

  // Gestion toast
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Chargement initial depuis localStorage
  useEffect(() => {
    const savedZones = localStorage.getItem("smartWarehouseZones");
    if (savedZones) {
      setZones(JSON.parse(savedZones));
    }

    const savedMap = localStorage.getItem("smartWarehouseMap");
    if (savedMap) {
      setMapUrl(savedMap);
    }

    const savedScenarios = localStorage.getItem("smartWarehouseScenarios");
    if (savedScenarios) {
      try {
        const parsed = JSON.parse(savedScenarios);
        setScenarios(parsed);
      } catch {
        // ignore
      }
    }

    const savedBaseline = localStorage.getItem("smartWarehouseBaseline");
    if (savedBaseline) {
      try {
        const parsed = JSON.parse(savedBaseline);
        setBaselineZones(parsed.zones || null);
        setBaselineMetrics(parsed.metrics || null);
        setBaselineName(parsed.name || "Baseline");
      } catch {
        // ignore
      }
    }

    const savedSettings = localStorage.getItem("smartWarehouseSettings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettingsGeneral((prev) => ({
          ...prev,
          ...parsed,
        }));
      } catch {
        // ignore
      }
    }
  }, []);

  // Persistance zones
  useEffect(() => {
    localStorage.setItem("smartWarehouseZones", JSON.stringify(zones));
  }, [zones]);

  // Persistance scénarios
  useEffect(() => {
    localStorage.setItem("smartWarehouseScenarios", JSON.stringify(scenarios));
  }, [scenarios]);

  // Persistance baseline
  useEffect(() => {
    if (!baselineZones || !baselineMetrics) return;
    localStorage.setItem(
      "smartWarehouseBaseline",
      JSON.stringify({
        zones: baselineZones,
        metrics: baselineMetrics,
        name: baselineName,
      })
    );
  }, [baselineZones, baselineMetrics, baselineName]);

  // Persistance paramètres généraux
  useEffect(() => {
    localStorage.setItem(
      "smartWarehouseSettings",
      JSON.stringify(settingsGeneral)
    );
  }, [settingsGeneral]);

  // Sauvegarder le layout courant
  const saveLayout = () => {
    localStorage.setItem("smartWarehouseZones", JSON.stringify(zones));
    localStorage.setItem("smartWarehouseMap", mapUrl);
    showToast(
      settingsGeneral.language === "en"
        ? "Layout saved"
        : "Layout sauvegardé",
      "success"
    );
  };

  // Charger le layout
  const loadLayout = () => {
    const savedZones = localStorage.getItem("smartWarehouseZones");
    const savedMap = localStorage.getItem("smartWarehouseMap");
    if (savedZones) {
      setZones(JSON.parse(savedZones));
    }
    if (savedMap) {
      setMapUrl(savedMap);
    }
    showToast(
      settingsGeneral.language === "en"
        ? "Layout loaded"
        : "Layout chargé",
      "info"
    );
  };

  // Réinitialiser le layout
  const resetLayout = () => {
    setZones([]);
    setMapUrl(null);
    localStorage.removeItem("smartWarehouseZones");
    localStorage.removeItem("smartWarehouseMap");
    setBeforeMetrics(null);
    setAfterMetrics(null);
    setActiveScenarioId(null);
    showToast(
      settingsGeneral.language === "en"
        ? "Layout reset"
        : "Layout réinitialisé",
      "warning"
    );
  };

  // Callback métriques
  const handleMetricsChange = (before, after) => {
    setBeforeMetrics(before);
    setAfterMetrics(after);
  };

  // Callback stratégie
  const handleStrategyChange = (value) => {
    setStrategy(value);
  };

  // Définir une baseline
  const handleSetBaseline = () => {
    if (!beforeMetrics || zones.length === 0) {
      showToast(
        settingsGeneral.language === "en"
          ? "No metrics available to define baseline."
          : "Aucune métrique disponible pour définir la baseline.",
        "warning"
      );
      return;
    }

    const defaultName =
      activeScenarioId &&
      scenarios.find((s) => s.id === activeScenarioId)?.name
        ? `Baseline ${scenarios.find((s) => s.id === activeScenarioId)?.name}`
        : "Baseline";

    const name = window.prompt(
      settingsGeneral.language === "en"
        ? "Baseline name"
        : "Nom de la baseline",
      defaultName
    );
    if (!name) return;

    setBaselineZones(zones);
    setBaselineMetrics(beforeMetrics);
    setBaselineName(name);
    showToast(
      settingsGeneral.language === "en"
        ? `Baseline defined from current layout: ${name}.`
        : `Baseline définie à partir du layout courant : ${name}.`,
      "success"
    );
  };

  // Enregistrer comme scénario
  const handleSaveAsScenario = () => {
    if (!beforeMetrics) {
      showToast(
        settingsGeneral.language === "en"
          ? "No metrics available. Run an optimization first."
          : "Aucune métrique disponible. Lance d'abord une optimisation.",
        "warning"
      );
      return;
    }

    const defaultName =
      settingsGeneral.language === "en"
        ? `Scenario ${scenarios.length + 1}`
        : `Scénario ${scenarios.length + 1}`;
    const name = window.prompt(
      settingsGeneral.language === "en"
        ? "Scenario name"
        : "Nom du scénario",
      defaultName
    );
    if (!name) return;

    const id = `sc-${Date.now()}`;

    const newScenario = {
      id,
      name,
      createdAt: new Date().toISOString(),
      strategy,
      mapUrl,
      zones,
      beforeMetrics: baselineMetrics || beforeMetrics,
      afterMetrics: afterMetrics || beforeMetrics,
    };

    setScenarios((prev) => [...prev, newScenario]);
    setActiveScenarioId(id);
    showToast(
      settingsGeneral.language === "en"
        ? "Scenario saved"
        : "Scénario enregistré",
      "success"
    );
  };

  // Mettre à jour scénario actif
  const handleUpdateScenario = () => {
    if (!activeScenarioId) {
      showToast(
        settingsGeneral.language === "en"
          ? "No active scenario to update."
          : "Aucun scénario actif à mettre à jour.",
        "warning"
      );
      return;
    }
    setScenarios((prev) =>
      prev.map((sc) =>
        sc.id === activeScenarioId
          ? {
              ...sc,
              strategy,
              mapUrl,
              zones,
              beforeMetrics:
                baselineMetrics || beforeMetrics || sc.beforeMetrics,
              afterMetrics: afterMetrics || beforeMetrics || sc.afterMetrics,
              updatedAt: new Date().toISOString(),
            }
          : sc
      )
    );
    showToast(
      settingsGeneral.language === "en"
        ? "Scenario updated"
        : "Scénario mis à jour",
      "success"
    );
  };

  // Charger un scénario
  const handleLoadScenario = () => {
    if (scenarios.length === 0) {
      showToast(
        settingsGeneral.language === "en"
          ? "No scenarios saved yet."
          : "Aucun scénario enregistré pour le moment.",
        "info"
      );
      return;
    }

    const label = scenarios
      .map((s, idx) => `${idx + 1}. ${s.name}`)
      .join("\n");
    const input = window.prompt(
      (settingsGeneral.language === "en"
        ? "Which scenario to load?\n"
        : "Quel scénario charger ?\n") +
        label +
        "\n\n" +
        (settingsGeneral.language === "en"
          ? "Enter the scenario number:"
          : "Entrez le numéro du scénario :")
    );
    if (!input) return;
    const index = parseInt(input, 10) - 1;
    if (Number.isNaN(index) || index < 0 || index >= scenarios.length) {
      showToast(
        settingsGeneral.language === "en"
          ? "Invalid scenario number."
          : "Numéro de scénario invalide.",
        "danger"
      );
      return;
    }

    const selected = scenarios[index];
    setActiveScenarioId(selected.id);
    setStrategy(selected.strategy || "balanced");
    setMapUrl(selected.mapUrl || null);
    setZones(selected.zones || []);
    setBeforeMetrics(selected.beforeMetrics || null);
    setAfterMetrics(selected.afterMetrics || null);
    showToast(
      settingsGeneral.language === "en"
        ? `Scenario "${selected.name}" loaded.`
        : `Scénario "${selected.name}" chargé.`,
      "info"
    );
  };

  // Meilleur scénario selon la stratégie
  const bestScenario = useMemo(() => {
    if (!scenarios || scenarios.length === 0) return null;

    const scored = scenarios
      .filter((sc) => sc.afterMetrics && sc.beforeMetrics)
      .map((sc) => {
        const b = sc.beforeMetrics;
        const a = sc.afterMetrics;

        const distanceGain =
          b?.totalDistance && a?.totalDistance
            ? (b.totalDistance - a.totalDistance) / b.totalDistance
            : 0;
        const timeGain =
          b?.totalTime && a?.totalTime
            ? (b.totalTime - a.totalTime) / b.totalTime
            : 0;
        const costGain =
          b?.totalCost && a?.totalCost
            ? (b.totalCost - a.totalCost) / b.totalCost
            : 0;

        let score = 0;
        if (strategy === "distance") score = distanceGain;
        else if (strategy === "time") score = timeGain;
        else if (strategy === "cost") score = costGain;
        else score = (distanceGain + timeGain + costGain) / 3;

        return {
          scenario: sc,
          score,
          distanceGain,
          timeGain,
          costGain,
        };
      });

    if (scored.length === 0) return null;
    scored.sort((a, b) => b.score - a.score);
    return scored[0];
  }, [scenarios, strategy]);

  const activeScenarioName =
    scenarios.find((s) => s.id === activeScenarioId)?.name ||
    (settingsGeneral.language === "en"
      ? "No scenario"
      : "Aucun scénario");

  // Rendu du contenu principal
  const renderMainContent = () => {
    if (activeView === "layout") {
      return (
        <>
          <section className="panel">
            <h2>1. Carte du dépôt</h2>
            <MapImporter onMapLoad={setMapUrl} />
          </section>

          <section className="panel">
            <h2>2. Zones de stockage</h2>
            <ZonePlacer mapUrl={mapUrl} zones={zones} setZones={setZones} />
          </section>

          <section className="panel wide">
            <h2>3. Optimisation & métriques</h2>
            <OptimizationPanel
              zones={zones}
              setZones={setZones}     // <-- AJOUT
              baselineMetrics={baselineMetrics}
              onMetricsChange={handleMetricsChange}
              onStrategyChange={handleStrategyChange}
            />
          </section>
        </>
      );
    }

    if (activeView === "optimization") {
      return (
        <section className="panel wide">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div>
              <h2>Optimisation avancée</h2>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--muted)",
                  marginTop: 4,
                }}
              >
                Configurez vos stratégies, définissez une baseline et comparez
                plusieurs scénarios.
              </p>
              {bestScenario && (
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--muted)",
                    marginTop: 4,
                  }}
                >
                  Meilleur scénario selon la stratégie{" "}
                  <strong>{strategy}</strong> :{" "}
                  <strong>{bestScenario.scenario.name}</strong>
                </p>
              )}
              <p
                style={{
                  fontSize: 11,
                  color: "var(--muted)",
                  marginTop: 4,
                }}
              >
                Baseline actuelle : <strong>{baselineName}</strong>
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                alignItems: "flex-end",
              }}
            >
              <span style={{ fontSize: 11, color: "var(--muted)" }}>
                Scénario actif : <strong>{activeScenarioName}</strong>
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  className="btn small"
                  type="button"
                  onClick={handleLoadScenario}
                >
                  Charger un scénario
                </button>
                <button
                  className="btn small"
                  type="button"
                  onClick={handleUpdateScenario}
                >
                  Mettre à jour
                </button>
                <button
                  className="btn small primary"
                  type="button"
                  onClick={handleSaveAsScenario}
                >
                  Sauver comme scénario
                </button>
              </div>
              <button
                className="btn small"
                type="button"
                onClick={handleSetBaseline}
              >
                Définir comme baseline
              </button>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <OptimizationPanel
                zones={zones}
                setZones={setZones}              // OBLIGATOIRE
                baselineMetrics={baselineMetrics}
                onMetricsChange={handleMetricsChange}
                onStrategyChange={handleStrategyChange}
            />
          </div>
        </section>
      );
    }

    if (activeView === "dashboard") {
      return (
        <section className="panel wide">
          <h2>Dashboard analytique</h2>
          <AnalyticsDashboard
            beforeMetrics={beforeMetrics}
            afterMetrics={afterMetrics}
            zones={zones}
            scenarios={scenarios}
            bestScenario={bestScenario}
            strategy={strategy}
          />
        </section>
      );
    }

    if (activeView === "reports") {
      return (
        <section className="panel wide">
          <h2>Rapports & export</h2>
          <p
            style={{
              fontSize: 13,
              color: "var(--muted)",
              marginTop: 4,
            }}
          >
            Génère un rapport PDF professionnel à partir du layout, des KPI et
            des scénarios.
          </p>
          <div style={{ marginTop: 16 }}>
            <ReportGenerator
              warehouseName={warehouseName}
              userName={userName}
              beforeMetrics={beforeMetrics}
              afterMetrics={afterMetrics}
              zones={zones}
              scenarios={scenarios}
              bestScenario={bestScenario}
              strategy={strategy}
              layoutImage={layoutImage}
              optimizedLayoutImage={optimizedLayoutImage}
            />
          </div>
        </section>
      );
    }

    if (activeView === "settings") {
      return (
        <section className="panel wide">
          <h2>{t.settingsTitle}</h2>
          <p
            style={{
              fontSize: 13,
              color: "var(--muted)",
              marginTop: 4,
            }}
          >
            {t.settingsSubtitle}
          </p>

          <div className="settings-grid">
            {/* Application */}
            <div className="settings-card">
              <h3>{t.settingsAppTitle}</h3>
              <p>{t.settingsAppDesc}</p>

              <div className="field-group">
                <label>Langue de l’application</label>
                <select
                  value={settingsGeneral.language}
                  onChange={(e) =>
                    setSettingsGeneral((prev) => ({
                      ...prev,
                      language: e.target.value,
                    }))
                  }
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="ar">العربية</option>
                  <option value="amazigh">Tamazight</option>
                </select>
              </div>
            </div>

            {/* Affichage */}
            <div className="settings-card">
              <h3>{t.settingsDisplayTitle}</h3>
              <p>{t.settingsDisplayDesc}</p>

              <div className="field-group">
                <label>Thème</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    type="button"
                    className={`btn small ${
                      settingsGeneral.theme === "light" ? "primary" : ""
                    }`}
                    onClick={() =>
                      setSettingsGeneral((prev) => ({
                        ...prev,
                        theme: "light",
                      }))
                    }
                  >
                    Mode standard
                  </button>
                  <button
                    type="button"
                    className={`btn small ${
                      settingsGeneral.theme === "dark" ? "primary" : ""
                    }`}
                    onClick={() =>
                      setSettingsGeneral((prev) => ({
                        ...prev,
                        theme: "dark",
                      }))
                    }
                  >
                    Mode sombre
                  </button>
                </div>
              </div>
            </div>

            {/* Localisation & formats */}
            <div className="settings-card">
              <h3>{t.settingsLocTitle}</h3>
              <p>{t.settingsLocDesc}</p>

              <div className="field-group">
                <label>Fuseau horaire</label>
                <input
                  type="text"
                  value={settingsGeneral.timezone}
                  onChange={(e) =>
                    setSettingsGeneral((prev) => ({
                      ...prev,
                      timezone: e.target.value,
                    }))
                  }
                  placeholder="Europe/Paris, Africa/Casablanca..."
                />
              </div>

              <div className="field-group">
                <label>Devise</label>
                <select
                  value={settingsGeneral.currency}
                  onChange={(e) =>
                    setSettingsGeneral((prev) => ({
                      ...prev,
                      currency: e.target.value,
                    }))
                  }
                >
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                  <option value="MAD">MAD (د.م)</option>
                </select>
              </div>

              <div className="field-group">
                <label>Unité de distance</label>
                <select
                  value={settingsGeneral.distanceUnit}
                  onChange={(e) =>
                    setSettingsGeneral((prev) => ({
                      ...prev,
                      distanceUnit: e.target.value,
                    }))
                  }
                >
                  <option value="m">mètre (m)</option>
                  <option value="km">kilomètre (km)</option>
                </select>
              </div>

              <div className="field-group">
                <label>Unité de surface</label>
                <select
                  value={settingsGeneral.areaUnit}
                  onChange={(e) =>
                    setSettingsGeneral((prev) => ({
                      ...prev,
                      areaUnit: e.target.value,
                    }))
                  }
                >
                  <option value="m2">m²</option>
                </select>
              </div>

              <div className="field-group">
                <label>Format de date</label>
                <select
                  value={settingsGeneral.dateFormat}
                  onChange={(e) =>
                    setSettingsGeneral((prev) => ({
                      ...prev,
                      dateFormat: e.target.value,
                    }))
                  }
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>
        </section>
      );
    }

    return null;
  };

  return (
    <div
      className={`app-shell ${
        settingsGeneral.theme === "dark" ? "theme-dark" : "theme-light"
      }`}
    >
      <div className="app-layout">
        <aside className="app-sidebar">
          <div className="sidebar-logo">
            <span className="logo-dot" />
            <span className="logo-text">Smart Warehouse</span>
          </div>

          <nav className="sidebar-nav">
            <button
              type="button"
              className={`sidebar-item ${
                activeView === "layout" ? "active" : ""
              }`}
              onClick={() => setActiveView("layout")}
            >
              <span className="sidebar-icon">📍</span>
              <span className="sidebar-label">{t.menuLayout}</span>
            </button>

            <button
              type="button"
              className={`sidebar-item ${
                activeView === "optimization" ? "active" : ""
              }`}
              onClick={() => setActiveView("optimization")}
            >
              <span className="sidebar-icon">⚙️</span>
              <span className="sidebar-label">{t.menuOpti}</span>
            </button>

            <button
              type="button"
              className={`sidebar-item ${
                activeView === "dashboard" ? "active" : ""
              }`}
              onClick={() => setActiveView("dashboard")}
            >
              <span className="sidebar-icon">📊</span>
              <span className="sidebar-label">{t.menuDashboard}</span>
            </button>

            <button
              type="button"
              className={`sidebar-item ${
                activeView === "reports" ? "active" : ""
              }`}
              onClick={() => setActiveView("reports")}
            >
              <span className="sidebar-icon">📄</span>
              <span className="sidebar-label">{t.menuReports}</span>
            </button>

            <button
              type="button"
              className={`sidebar-item ${
                activeView === "settings" ? "active" : ""
              }`}
              onClick={() => setActiveView("settings")}
            >
              <span className="sidebar-icon">🛠️</span>
              <span className="sidebar-label">{t.menuSettings}</span>
            </button>
          </nav>

          <div className="sidebar-footer">
            <span className="sidebar-env">Nassira FAHFOUHI | Ingénieure Aéronautique</span>
          </div>
        </aside>

        <div className="app-main-wrapper">
          <header className="app-header">
            <div>
              <h1>{t.title}</h1>
              <p>{t.subtitle}</p>
            </div>
            <div className="header-actions">
              <button
                type="button"
                className="btn small"
                onClick={loadLayout}
              >
                {t.btnLoad}
              </button>
              <button
                type="button"
                className="btn small danger"
                onClick={resetLayout}
              >
                {t.btnReset}
              </button>
              <button
                type="button"
                className="btn small primary"
                onClick={saveLayout}
              >
                {t.btnSave}
              </button>
            </div>
          </header>

          <div className="app-main-content">
            <main className="app-main">{renderMainContent()}</main>

            <aside className="app-robot-panel">
              <RobotHelper
                zones={zones}
                beforeMetrics={beforeMetrics}
                afterMetrics={afterMetrics}
                strategy={strategy}
                bestScenario={bestScenario}
                scenarios={scenarios}
              />
            </aside>
          </div>

          <footer className="app-footer">
            <span>{t.footer}</span>
          </footer>
        </div>
      </div>

      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
    </div>
  );
}

export default App;
