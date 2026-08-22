import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  HiOutlineCheck,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlinePlus,
  HiOutlineStar,
  HiOutlineX,
  HiOutlineCash,
  HiOutlineCollection,
  HiOutlineSparkles,
  HiOutlineSearch,
  HiOutlineCreditCard,
} from "react-icons/hi";

import { PageHeader, SearchInput, Tabs } from "../components/ui/Controls";
import GlassCard from "../components/ui/GlassCard";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";

import {
  getAllPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
} from "../services/Apis/plans";

const emptyForm = {
  name: "",
  subtitle: "",
  monthly: "",
  annual: "",
  isPopular: false,
  features: [],
};

/* =========================================================
   Stat Card
========================================================= */

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  iconClass = "text-gold",
  delay = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
  >
    <div className="group relative overflow-hidden rounded-card border border-gold/[0.14] bg-card/70 p-5 shadow-soft backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-gold/30">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gold/[0.05] blur-2xl transition group-hover:bg-gold/[0.10]" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-ink-muted">{title}</p>

          <h2 className="mt-2 max-w-[180px] truncate font-display text-3xl font-bold tracking-tight text-white">
            {value}
          </h2>

          <p className="mt-2 text-[11px] text-ink-faint">
            {description}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold/[0.14] bg-gold/[0.08] text-xl ${iconClass}`}
        >
          <Icon />
        </div>
      </div>
    </div>
  </motion.div>
);

/* =========================================================
   Subscription Page
========================================================= */

export default function Subscriptions() {
  const [plans, setPlans] = useState([]);

  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");

  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* =========================================================
     Fetch
  ========================================================= */

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getAllPlans();

      setPlans(res.data?.plans || []);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to fetch subscription plans."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  /* =========================================================
     Stats
  ========================================================= */

  const popularCount = plans.filter(
    (plan) => plan.isPopular
  ).length;

  const averageMonthly =
    plans.length > 0
      ? plans.reduce(
          (sum, plan) =>
            sum + Number(plan.prices?.monthly || 0),
          0
        ) / plans.length
      : 0;

  const totalFeatures = plans.reduce(
    (sum, plan) => sum + (plan.features?.length || 0),
    0
  );

  /* =========================================================
     Filter
  ========================================================= */

  const filteredPlans = useMemo(() => {
    return plans
      .filter((plan) => {
        if (tab === "Popular") return plan.isPopular;
        return true;
      })
      .filter((plan) => {
        const value = search.toLowerCase();

        return (
          plan.name?.toLowerCase().includes(value) ||
          plan.subtitle?.toLowerCase().includes(value)
        );
      });
  }, [plans, tab, search]);

  /* =========================================================
     Create
  ========================================================= */

  const openCreate = () => {
    setError("");

    setForm({
      ...emptyForm,
      features: [],
    });

    setCreating(true);
  };

  /* =========================================================
     Edit
  ========================================================= */

  const openEdit = async (plan) => {
    try {
      setError("");

      const res = await getPlanById(plan._id);

      const data = res.data?.plan || res.data;

      setEditing(data);

      setForm({
        name: data.name || "",
        subtitle: data.subtitle || "",
        monthly: data.prices?.monthly ?? "",
        annual: data.prices?.annual ?? "",
        isPopular: data.isPopular ?? false,
        features: (data.features || []).map((feature) => ({
          text: feature.text || "",
          included: feature.included ?? true,
        })),
      });
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load plan details."
      );
    }
  };

  /* =========================================================
     Form
  ========================================================= */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFeatureChange = (index, value) => {
    setForm((prev) => {
      const features = [...prev.features];

      features[index] = {
        ...features[index],
        text: value,
      };

      return {
        ...prev,
        features,
      };
    });
  };

  const handleFeatureIncluded = (index, checked) => {
    setForm((prev) => {
      const features = [...prev.features];

      features[index] = {
        ...features[index],
        included: checked,
      };

      return {
        ...prev,
        features,
      };
    });
  };

  const addFeature = () => {
    setForm((prev) => ({
      ...prev,
      features: [
        ...prev.features,
        {
          text: "",
          included: true,
        },
      ],
    }));
  };

  const removeFeature = (index) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter(
        (_, i) => i !== index
      ),
    }));
  };

  /* =========================================================
     Create API
  ========================================================= */

  const saveCreate = async () => {
    try {
      setSaving(true);
      setError("");

      if (!form.name.trim()) {
        setError("Plan name is required.");
        return;
      }

      const payload = {
        name: form.name.trim(),
        subtitle: form.subtitle.trim(),

        prices: {
          monthly: Number(form.monthly),
          annual: Number(form.annual),
        },

        features: form.features
          .filter((feature) => feature.text.trim())
          .map((feature) => ({
            text: feature.text.trim(),
            included: Boolean(feature.included),
          })),

        isPopular: Boolean(form.isPopular),
      };

      await createPlan(payload);

      await fetchPlans();

      setCreating(false);
      setForm(emptyForm);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to create plan."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     Update API
  ========================================================= */

  const saveEdit = async () => {
    try {
      setSaving(true);
      setError("");

      const payload = {
        subtitle: form.subtitle.trim(),

        prices: {
          monthly: Number(form.monthly),
          annual: Number(form.annual),
        },

        features: form.features
          .filter((feature) => feature.text.trim())
          .map((feature) => ({
            text: feature.text.trim(),
            included: Boolean(feature.included),
          })),

        isPopular: Boolean(form.isPopular),
      };

      await updatePlan(editing._id, payload);

      await fetchPlans();

      setEditing(null);
      setForm(emptyForm);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to update plan."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     Delete
  ========================================================= */

  const confirmDelete = async () => {
    try {
      setSaving(true);
      setError("");

      await deletePlan(deleting._id);

      await fetchPlans();

      setDeleting(null);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to delete plan."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     Form UI
  ========================================================= */

  const inputClass =
    "w-full rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-3 text-sm text-white placeholder:text-ink-faint outline-none transition focus:border-gold/40 focus:bg-gold/[0.035] focus:ring-2 focus:ring-gold/10";

  const renderForm = (isEdit = false) => (
    <div className="space-y-5">
      {!isEdit && (
        <div>
          <label className="mb-2 block text-xs font-semibold text-ink-muted">
            Plan Name
          </label>

          <input
            type="text"
            name="name"
            placeholder="e.g. Gold"
            value={form.name}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      )}

      <div>
        <label className="mb-2 block text-xs font-semibold text-ink-muted">
          Subtitle
        </label>

        <input
          type="text"
          name="subtitle"
          placeholder="Perfect for serious dating"
          value={form.subtitle}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-2 block text-xs font-semibold text-ink-muted">
            Monthly Price
          </label>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold">
              $
            </span>

            <input
              type="number"
              name="monthly"
              value={form.monthly}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={`${inputClass} pl-8`}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold text-ink-muted">
            Annual Price
          </label>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold">
              $
            </span>

            <input
              type="number"
              name="annual"
              value={form.annual}
              onChange={handleChange}
              min="0"
              step="0.01"
              className={`${inputClass} pl-8`}
            />
          </div>
        </div>
      </div>

      <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gold/[0.12] bg-gold/[0.04] px-4 py-3 transition hover:border-gold/30">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10 text-gold">
            <HiOutlineStar />
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              Popular Plan
            </p>

            <p className="text-[10px] text-ink-faint">
              Highlight this plan for users
            </p>
          </div>
        </div>

        <input
          type="checkbox"
          name="isPopular"
          checked={form.isPopular}
          onChange={handleChange}
          className="h-4 w-4 accent-[#E8C15B]"
        />
      </label>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">
              Features
            </p>

            <p className="mt-0.5 text-[10px] text-ink-faint">
              Add benefits included in this plan
            </p>
          </div>

          <button
            type="button"
            onClick={addFeature}
            className="flex items-center gap-1.5 rounded-lg border border-gold/20 bg-gold/[0.05] px-3 py-2 text-xs font-semibold text-gold transition hover:border-gold/40 hover:bg-gold/10"
          >
            <HiOutlinePlus />
            Add
          </button>
        </div>

        <div className="space-y-2">
          {form.features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Feature description"
                value={feature.text}
                onChange={(e) =>
                  handleFeatureChange(
                    index,
                    e.target.value
                  )
                }
                className={`${inputClass} min-w-0 flex-1 py-2.5`}
              />

              <label className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03]">
                <input
                  type="checkbox"
                  checked={feature.included}
                  onChange={(e) =>
                    handleFeatureIncluded(
                      index,
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 accent-[#E8C15B]"
                />
              </label>

              <button
                type="button"
                onClick={() =>
                  removeFeature(index)
                }
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 transition hover:bg-red-500/20"
              >
                <HiOutlineX />
              </button>
            </motion.div>
          ))}

          {form.features.length === 0 && (
            <div className="rounded-xl border border-dashed border-white/[0.08] px-4 py-7 text-center">
              <HiOutlineSparkles className="mx-auto text-2xl text-ink-faint" />

              <p className="mt-2 text-xs text-ink-faint">
                No features added yet
              </p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400">
          {error}
        </div>
      )}

      <Button
        variant="primary"
        className="w-full"
        onClick={isEdit ? saveEdit : saveCreate}
        disabled={saving}
      >
        {saving
          ? isEdit
            ? "Saving Changes..."
            : "Creating Plan..."
          : isEdit
          ? "Save Changes"
          : "Create Plan"}
      </Button>
    </div>
  );

  /* =========================================================
     Render
  ========================================================= */

  return (
    <div className="px-4 pb-6 pt-0 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-6">

        {/* =================================================
            Header
        ================================================= */}

        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-card border border-gold/[0.14] bg-card/70 p-6 shadow-soft backdrop-blur-xl sm:p-7"
        >
          <div className="relative flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]" />

                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                  Business Center
                </span>
              </div>

              <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-gold">
                Membership Management
              </p>

              <h1 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
                Subscription Plans
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-ink-muted">
                Manage BUMMPS membership plans, pricing,
                premium benefits, and featured subscription
                tiers.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-gold/[0.14] bg-gold/[0.08] text-2xl text-gold">
                <HiOutlineCreditCard />
              </div>

              <Button
                variant="primary"
                icon={HiOutlinePlus}
                onClick={openCreate}
              >
                Add Plan
              </Button>
            </div>
          </div>
        </motion.div>

        {/* =================================================
            Stats
        ================================================= */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Plans"
            value={plans.length}
            description="Available membership tiers"
            icon={HiOutlineCollection}
            iconClass="text-gold"
            delay={0.05}
          />

          <StatCard
            title="Popular Plans"
            value={popularCount}
            description="Featured membership tiers"
            icon={HiOutlineStar}
            iconClass="text-yellow-400"
            delay={0.1}
          />

          <StatCard
            title="Average Price"
            value={`$${averageMonthly.toFixed(0)}`}
            description="Average monthly subscription"
            icon={HiOutlineCash}
            iconClass="text-emerald-400"
            delay={0.15}
          />

          <StatCard
            title="Total Features"
            value={totalFeatures}
            description="Benefits across all plans"
            icon={HiOutlineSparkles}
            iconClass="text-purple-400"
            delay={0.2}
          />
        </div>

        {/* =================================================
            Main Section
        ================================================= */}

        <GlassCard className="overflow-hidden">

          {/* Section Header */}

          <div className="border-b border-gold/[0.08] p-5 sm:p-6">

            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

              <div>
                <h2 className="font-display text-lg font-bold text-white">
                  Membership Plans
                </h2>

                <p className="mt-1 text-xs text-ink-muted">
                  Review, edit, and manage subscription
                  plans available to BUMMPS users.
                </p>
              </div>

              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search plans..."
                className="w-full sm:w-72"
              />

            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <Tabs
                tabs={["All", "Popular"]}
                active={tab}
                onChange={setTab}
              />

              <div className="text-xs text-ink-faint">
                Showing{" "}
                <span className="font-semibold text-gold">
                  {filteredPlans.length}
                </span>{" "}
                plans
              </div>

            </div>
          </div>

          {/* =================================================
              Cards
          ================================================= */}

          <div className="p-5 sm:p-6">

            {loading ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-[440px] animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.025]"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

                {filteredPlans.map((plan, index) => (
                  <motion.div
                    key={plan._id}
                    initial={{
                      opacity: 0,
                      y: 15,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay: index * 0.06,
                    }}
                  >

                    {/* =================================================
                        SAME SIZE CARD
                    ================================================= */}

                    <div
                      className={`group relative flex h-[440px] flex-col overflow-hidden rounded-2xl border p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-soft ${
                        plan.isPopular
                          ? "border-gold/35 bg-gradient-to-b from-gold/[0.10] via-card/70 to-card/70"
                          : "border-gold/[0.12] bg-card/60 hover:border-gold/30"
                      }`}
                    >

                      {/* Glow */}

                      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gold/[0.08] blur-3xl" />

                      {/* Popular */}

                      {plan.isPopular && (
                        <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-gold-gradient px-2.5 py-1 text-[8px] font-bold uppercase tracking-wider text-black">
                          <HiOutlineStar />
                          Popular
                        </div>
                      )}

                      {/* Top */}

                      <div className="relative flex items-start justify-between">

                        <div className="flex items-center gap-3">

                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gold/[0.14] bg-gold/[0.08] text-xl text-gold">
                            <HiOutlineStar />
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">
                              {plan.name}
                            </p>

                            <p className="mt-0.5 max-w-[150px] truncate text-[11px] text-ink-faint">
                              {plan.subtitle ||
                                "Premium membership"}
                            </p>
                          </div>

                        </div>

                      </div>

                      {/* Divider */}

                      <div className="my-4 h-px bg-white/[0.05]" />

                      {/* Pricing */}

                      <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4">

                        <p className="text-[9px] uppercase tracking-wider text-ink-faint">
                          Monthly Price
                        </p>

                        <div className="mt-1 flex items-end gap-1">
                          <span className="font-display text-3xl font-extrabold text-white">
                            $
                            {Number(
                              plan.prices?.monthly || 0
                            ).toFixed(0)}
                          </span>

                          <span className="mb-1 text-[11px] text-ink-faint">
                            / month
                          </span>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[10px] text-ink-faint">
                            Annual
                          </span>

                          <span className="text-xs font-semibold text-gold">
                            $
                            {Number(
                              plan.prices?.annual || 0
                            ).toFixed(2)}
                          </span>
                        </div>

                      </div>

                      {/* Features */}

                      <div className="mt-4 flex-1 min-h-0">

                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-[9px] uppercase tracking-wider text-ink-faint">
                            Plan Benefits
                          </p>

                          <span className="text-[9px] text-gold">
                            {plan.features?.length || 0}{" "}
                            features
                          </span>
                        </div>

                        <div className="max-h-[135px] overflow-hidden">

                          <ul className="space-y-2.5">
                            {(plan.features || [])
                              .slice(0, 5)
                              .map(
                                (
                                  feature,
                                  featureIndex
                                ) => (
                                  <li
                                    key={
                                      feature._id ||
                                      featureIndex
                                    }
                                    className={`flex items-start gap-2 text-xs ${
                                      feature.included
                                        ? "text-ink-muted"
                                        : "text-ink-faint line-through"
                                    }`}
                                  >
                                    <span
                                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                                        feature.included
                                          ? "bg-gold/10 text-gold"
                                          : "bg-white/[0.04] text-ink-faint"
                                      }`}
                                    >
                                      <HiOutlineCheck className="text-[9px]" />
                                    </span>

                                    <span className="line-clamp-1">
                                      {feature.text}
                                    </span>
                                  </li>
                                )
                              )}
                          </ul>

                        </div>

                        {plan.features?.length > 5 && (
                          <p className="mt-2 text-[10px] text-gold">
                            +{" "}
                            {plan.features.length - 5}{" "}
                            more benefits
                          </p>
                        )}

                      </div>

                      {/* Footer */}

                      <div className="mt-4 border-t border-white/[0.06] pt-4">

                        <div className="flex items-center justify-between text-[10px]">

                          <span className="text-ink-faint">
                            Plan status
                          </span>

                          <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            Active
                          </span>

                        </div>

                        {/* Actions */}

                        <div className="mt-3 flex gap-2">

                          <Button
                            variant="outline"
                            size="sm"
                            icon={HiOutlinePencil}
                            onClick={() =>
                              openEdit(plan)
                            }
                            className="flex-1"
                          >
                            Edit
                          </Button>

                          <button
                            title="Delete plan"
                            onClick={() =>
                              setDeleting(plan)
                            }
                            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-red-500/30 bg-red-500/10 text-red-400 transition-all hover:scale-110 hover:bg-red-500/20"
                          >
                            <HiOutlineTrash />
                          </button>

                        </div>

                      </div>

                    </div>

                  </motion.div>
                ))}

              </div>
            )}

            {/* Empty */}

            {!loading &&
              filteredPlans.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20">

                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-gold/[0.14] bg-gold/[0.06] text-2xl text-gold">
                    <HiOutlineSearch />
                  </div>

                  <p className="text-sm font-semibold text-white">
                    No subscription plans
                  </p>

                  <p className="mt-1 text-xs text-ink-faint">
                    Try changing your search or filter.
                  </p>

                  <div className="mt-5">
                    <Button
                      variant="primary"
                      icon={HiOutlinePlus}
                      onClick={openCreate}
                    >
                      Add Plan
                    </Button>
                  </div>

                </div>
              )}

          </div>
        </GlassCard>
      </div>

      {/* =====================================================
          Create Modal
      ===================================================== */}

      <Modal
        open={creating}
        onClose={() => {
          if (!saving) {
            setCreating(false);
            setError("");
          }
        }}
        title="Create Subscription Plan"
        maxWidth="max-w-lg"
      >
        {renderForm(false)}
      </Modal>

      {/* =====================================================
          Edit Modal
      ===================================================== */}

      <Modal
        open={!!editing}
        onClose={() => {
          if (!saving) {
            setEditing(null);
            setError("");
          }
        }}
        title={`Edit ${editing?.name || "Plan"}`}
        maxWidth="max-w-lg"
      >
        {renderForm(true)}
      </Modal>

      {/* =====================================================
          Delete Modal
      ===================================================== */}

      <Modal
        open={!!deleting}
        onClose={() => {
          if (!saving) {
            setDeleting(null);
          }
        }}
        title="Delete Plan"
        maxWidth="max-w-sm"
      >
        <div className="text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-2xl text-red-400">
            <HiOutlineTrash />
          </div>

          <h3 className="mt-4 font-display text-lg font-bold text-white">
            Delete Subscription Plan?
          </h3>

          <p className="mt-2 text-xs leading-5 text-ink-muted">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-white">
              {deleting?.name}
            </span>
            ? This action cannot be undone.
          </p>

        </div>

        <div className="mt-6 flex gap-3">

          <Button
            variant="danger"
            className="flex-1"
            onClick={confirmDelete}
            disabled={saving}
          >
            {saving ? "Deleting..." : "Delete Plan"}
          </Button>

          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setDeleting(null)}
            disabled={saving}
          >
            Cancel
          </Button>

        </div>
      </Modal>
    </div>
  );
}