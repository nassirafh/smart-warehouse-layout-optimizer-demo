// src/components/OptimizationPanel.jsx
import React, { useState, useEffect } from 'react';
import { optimizeLayout } from '../utils/algorithms';
import { calculateMetrics } from '../utils/calculations';

function OptimizationPanel({
  zones,
  setZones,            // <--- nouvelle prop pour mettre à jour les zones
  baselineMetrics,
  onMetricsChange,
  onStrategyChange,
}) {
  const [currentMetrics, setCurrentMetrics] = useState(null);
  const [afterMetrics, setAfterMetrics] = useState(null);
  const [strategy, setStrategy] = useState('balanced');

  // Recalcule les métriques du layout courant quand les zones changent
  useEffect(() => {
    if (zones.length === 0) {
      setCurrentMetrics(null);
      setAfterMetrics(null);
      if (onMetricsChange) onMetricsChange(null, null);
      return;
    }

    const base = calculateMetrics(zones);
    const current = {
      ...base,
      totalDistance: base.totalDistance,
      totalTime: base.time,
      totalCost: base.cost,
    };

    setCurrentMetrics(current);

    // Si on n’a pas encore d’afterMetrics, on compare baseline → current
    const effectiveAfter = afterMetrics || current;
    const effectiveBefore = baselineMetrics || current;

    if (onMetricsChange) {
      onMetricsChange(effectiveBefore, effectiveAfter);
    }
  }, [zones, baselineMetrics, afterMetrics, onMetricsChange]);

  // Bouton "Optimiser le layout"
  const handleOptimize = () => {
    if (zones.length === 0) return;

    // 1) calcul du layout optimisé selon ABC + stratégie
    const optimized = optimizeLayout(zones, strategy);

    // 2) MAJ de l’état global : les zones bougent et le tableau se reclasse
    setZones(optimized);

    // 3) calcul métriques avant/après
    const baseBefore = calculateMetrics(zones);
    const baseAfter = calculateMetrics(optimized);

    const before = {
      ...baseBefore,
      totalDistance: baseBefore.totalDistance,
      totalTime: baseBefore.time,
      totalCost: baseBefore.cost,
    };

    const after = {
      ...baseAfter,
      totalDistance: baseAfter.totalDistance,
      totalTime: baseAfter.time,
      totalCost: baseAfter.cost,
    };

    setCurrentMetrics(after);
    setAfterMetrics(after);

    // on notifie App avec baseline (si définie) et layout optimisé
    const effectiveBefore = baselineMetrics || before;
    if (onMetricsChange) {
      onMetricsChange(effectiveBefore, after);
    }
  };

  const zonesCount = zones.length;
  const totalDistance = currentMetrics
    ? currentMetrics.totalDistance.toFixed(2)
    : '-';
  const totalCost = currentMetrics ? currentMetrics.cost.toFixed(2) : '-';

  const handleStrategyChangeLocal = (value) => {
    setStrategy(value);
    if (onStrategyChange) onStrategyChange(value);
  };

  // Gains entre baseline et layout courant (ou optimisé)
  const beforeForGain = baselineMetrics || currentMetrics;
  const afterForGain = currentMetrics;

  const gain =
    beforeForGain && afterForGain
      ? {
          distanceAbs:
            beforeForGain.totalDistance - afterForGain.totalDistance,
          timeAbs: beforeForGain.time - afterForGain.time,
          costAbs: beforeForGain.cost - afterForGain.cost,
          distancePct:
            ((beforeForGain.totalDistance - afterForGain.totalDistance) /
              beforeForGain.totalDistance) *
            100,
          timePct:
            ((beforeForGain.time - afterForGain.time) /
              beforeForGain.time) *
            100,
          costPct:
            ((beforeForGain.cost - afterForGain.cost) /
              beforeForGain.cost) *
            100,
        }
      : null;

  return (
    <div className="optimization-panel">
      <div className="optimization-header">
        <div>
          <p className="opt-subtitle">
            Choisissez une stratégie, ajustez le layout ou lancez l&apos;optimisation.
          </p>
          <div className="opt-stats">
            <span>
              Zones : <strong>{zonesCount}</strong>
            </span>
            <span>
              Distance totale tournée : <strong>{totalDistance} m</strong>
            </span>
            <span>
              Coût estimé : <strong>{totalCost} €</strong>
            </span>
          </div>
        </div>
        <div className="optimization-controls">
          <label>
            Stratégie :
            <select
              value={strategy}
              onChange={(e) => handleStrategyChangeLocal(e.target.value)}
              className="opt-select"
            >
              <option value="distance">Minimiser la distance</option>
              <option value="time">Minimiser le temps</option>
              <option value="cost">Minimiser le coût</option>
              <option value="balanced">Équilibré</option>
            </select>
          </label>
          <button
            className="btn primary"
            onClick={handleOptimize}
            disabled={zones.length === 0}
          >
            Optimiser le layout
          </button>
        </div>
      </div>

      {!currentMetrics && (
        <p className="opt-empty">
          Ajoutez au moins une zone pour afficher les métriques.
        </p>
      )}

      {currentMetrics && (
        <div className="metrics-grid">
          <div className="metric-card">
            <h3>Baseline / Avant</h3>
            <div className="metric-row">
              <span>Distance totale tournée</span>
              <strong>
                {(baselineMetrics || currentMetrics).totalDistance.toFixed(2)} m
              </strong>
            </div>
            <div className="metric-row">
              <span>Temps total</span>
              <strong>
                {(baselineMetrics || currentMetrics).time.toFixed(2)} min
              </strong>
            </div>
            <div className="metric-row">
              <span>Coût estimé</span>
              <strong>
                {(baselineMetrics || currentMetrics).cost.toFixed(2)} €
              </strong>
            </div>
          </div>

          <div className="metric-card">
            <h3>Layout actuel</h3>
            <div className="metric-row">
              <span>Distance totale tournée</span>
              <strong>{currentMetrics.totalDistance.toFixed(2)} m</strong>
            </div>
            <div className="metric-row">
              <span>Temps total</span>
              <strong>{currentMetrics.time.toFixed(2)} min</strong>
            </div>
            <div className="metric-row">
              <span>Coût estimé</span>
              <strong>{currentMetrics.cost.toFixed(2)} €</strong>
            </div>
          </div>

          {gain && (
            <div className="metric-card gain-card">
              <h3>Gains (vs baseline)</h3>
              <div className="metric-row">
                <span>Distance</span>
                <strong>
                  {gain.distanceAbs.toFixed(2)} m (
                  {gain.distancePct.toFixed(2)} %)
                </strong>
              </div>
              <div className="metric-row">
                <span>Temps</span>
                <strong>
                  {gain.timeAbs.toFixed(2)} min (
                  {gain.timePct.toFixed(2)} %)
                </strong>
              </div>
              <div className="metric-row">
                <span>Coût</span>
                <strong>
                  {gain.costAbs.toFixed(2)} € (
                  {gain.costPct.toFixed(2)} %)
                </strong>
              </div>
              <p className="gain-note">
                Les valeurs indiquent la réduction entre la baseline et le layout actuel.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default OptimizationPanel;
