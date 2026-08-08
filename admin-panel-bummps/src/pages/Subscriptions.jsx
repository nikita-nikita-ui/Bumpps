import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HiOutlineCheck, HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiOutlineStar } from "react-icons/hi";
import { PageHeader } from "../components/ui/Controls";
import GlassCard from "../components/ui/GlassCard";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import Counter from "../components/ui/Counter";
import {
  getAllPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
} from "../services/Apis/plans";


export default function Subscriptions() {
  const [plans, setPlans] = useState([]);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [form, setForm] = useState({
    subtitle: "",
    monthly: "",
    annual: "",
    isPopular: false,
  });
  const fetchPlans = async () => {
    try {
      const res = await getAllPlans();
      console.log(res.data);
      setPlans(res.data.plans);
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };
  useEffect(() => {
    fetchPlans();
  }, []);

  const openEdit = async (plan) => {
    try {
      const res = await getPlanById(plan._id);

      console.log("Get Plan By ID:", res.data);

      const data = res.data.plan || res.data;

      setEditing(data);

      setForm({
        subtitle: data.subtitle,
        monthly: data.prices.monthly,
        annual: data.prices.annual,
        isPopular: data.isPopular,
      });

    } catch (error) {
      console.log("Get Plan By Id Error:", error);
    }
  };

  const saveEdit = async () => {
    try {
      const payload = {
        subtitle: form.subtitle,
        prices: {
          monthly: Number(form.monthly),
          annual: Number(form.annual),
        },
        isPopular: form.isPopular,
      };

      const res = await updatePlan(editing._id, payload);

      console.log(res.data);

      fetchPlans();

      setEditing(null);
    } catch (err) {
      console.log(err);
    }
  };
  const saveCreate = async () => {
    try {

      const payload = {
        subtitle: form.subtitle,
        prices: {
          monthly: Number(form.monthly),
          annual: Number(form.annual),
        },
        isPopular: form.isPopular,
      };


      const res = await createPlan(payload);

      console.log("Create Plan:", res.data);


      fetchPlans();

      setCreating(false);


    } catch (error) {

      console.log("Create Plan Error:", error);

    }
  };
  const confirmDelete = async () => {
    try {
      const res = await deletePlan(deleting._id);

      console.log(res.data);

      fetchPlans();

      setDeleting(null);
    } catch (error) {
      console.log(error);
    }
  };

  const totalRevenue = plans.reduce(
    (sum, plan) => sum + plan.prices.monthly,
    0
  );
  const totalSubs = plans.length;

  return (
    <div>
      <PageHeader
        eyebrow="Business"
        title="Subscription Plans"
        description="Manage membership tiers and pricing across BUMMPS."
        actions={
          <Button
            variant="primary"
            icon={HiOutlinePlus}
            onClick={() => {
              setForm({
                subtitle: "",
                monthly: "",
                annual: "",
                isPopular: false,
              });

              setCreating(true);
            }}
          >
            Add Plan
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8 max-w-xl">
        <GlassCard className="p-5" hover>
          <p className="text-xs uppercase tracking-widest text-ink-muted">Total Subscribers</p>
          <h3 className="font-display text-2xl font-bold text-white mt-2"><Counter value={totalSubs} /></h3>
        </GlassCard>
        <GlassCard className="p-5" hover>
          <p className="text-xs uppercase tracking-widest text-ink-muted">Total Revenue</p>
          <h3 className="font-display text-2xl font-bold text-gold mt-2"><Counter value={totalRevenue} prefix="$" decimals={0} /></h3>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {plans.map((plan, i) => (
          <motion.div key={plan._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ y: -6 }}>
            <div
              className={`relative flex h-full flex-col overflow-hidden rounded-card border p-6 backdrop-blur-xl shadow-soft ${plan.isPopular
                ? "border-gold/40 bg-gradient-to-b from-gold/[0.08] to-card/70"
                : "border-gold/[0.14] bg-card/70"
                }`}
            >
              {plan.isPopular && (
                <span className="absolute right-4 top-4 flex items-center gap-1 rounded-pill bg-gold-gradient px-2.5 py-1 text-[10px] font-bold text-black">
                  <HiOutlineStar /> Popular
                </span>
              )}
              <p className="text-xs font-bold uppercase tracking-widest text-gold">
                {plan.name}
              </p>
              <h3 className="font-display text-3xl font-extrabold text-white mt-2">
                ${plan.prices.monthly}<span className="text-sm font-medium text-ink-faint">/mo</span>
              </h3>
              <ul className="mt-5 space-y-2.5 flex-1">
                {plan.features.map((feature) => (
                  <li
                    key={feature._id}
                    className="flex items-start gap-2 text-sm text-ink-muted"
                  >
                    <HiOutlineCheck className="mt-0.5 shrink-0 text-gold" />
                    {feature.text}
                  </li>
                ))}
              </ul>
              <div className="mt-6 border-t border-white/5 pt-4 text-xs text-ink-faint">
                <span className="text-white font-semibold">
                  Annual: ${plan.prices.annual}
                </span>
                <br />
                <span className="text-gold font-semibold">
                  {plan.subtitle}
                </span>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" icon={HiOutlinePencil} onClick={() => openEdit(plan)} className="flex-1">Edit</Button>
                <button onClick={() => setDeleting(plan)} className="grid h-9 w-9 shrink-0 place-items-center rounded-pill border border-danger/30 bg-danger/10 text-danger transition-transform hover:scale-110">
                  <HiOutlineTrash className="text-sm" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="Create Plan"
        maxWidth="max-w-sm"
      >

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Subtitle"
            value={form.subtitle}
            onChange={(e) =>
              setForm({
                ...form,
                subtitle: e.target.value,
              })
            }
            className="w-full rounded-xl border border-[#E8C15B40] bg-[#1F2129] px-4 py-3 text-white placeholder:text-gray-400 outline-none transition-all duration-200 focus:border-[#E8C15B] focus:ring-2 focus:ring-[#E8C15B]/20"
          />


          <input
            type="number"
            placeholder="Monthly Price"
            value={form.monthly}
            onChange={(e) =>
              setForm({
                ...form,
                monthly: e.target.value,
              })
            }
            className="w-full rounded-xl border border-[#E8C15B40] bg-[#1F2129] px-4 py-3 text-white placeholder:text-gray-400 outline-none focus:border-[#E8C15B] focus:ring-2 focus:ring-[#E8C15B]/20"
          />


          <input
            type="number"
            placeholder="Annual Price"
            value={form.annual}
            onChange={(e) =>
              setForm({
                ...form,
                annual: e.target.value,
              })
            }
            className="w-full rounded-xl border border-[#E8C15B40] bg-[#1F2129] px-4 py-3 text-white placeholder:text-gray-400 outline-none focus:border-[#E8C15B] focus:ring-2 focus:ring-[#E8C15B]/20"
          />


          <Button
            variant="primary"
            className="w-full"
            onClick={saveCreate}
          >
            Create Plan
          </Button>


        </div>

      </Modal>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit Plan"
        maxWidth="max-w-sm"
      >

        <div className="space-y-4">

          <input
            placeholder="Subtitle"
            value={form.subtitle}
            onChange={(e) =>
              setForm({
                ...form,
                subtitle: e.target.value
              })
            }
          />


          <input
            placeholder="Monthly Price"
            type="number"
            value={form.monthly}
            onChange={(e) =>
              setForm({
                ...form,
                monthly: e.target.value
              })
            }
          />


          <input
            placeholder="Annual Price"
            type="number"
            value={form.annual}
            onChange={(e) =>
              setForm({
                ...form,
                annual: e.target.value
              })
            }
          />


          <Button
            variant="primary"
            className="w-full"
            onClick={saveEdit}
          >
            Save Changes
          </Button>


        </div>

      </Modal>

      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="Delete Plan" maxWidth="max-w-sm">
        <p className="text-sm text-ink-muted mb-6">Are you sure you want to delete the <span className="text-white font-medium">{deleting?.subtitle}</span> plan? This action cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="danger" className="flex-1" onClick={confirmDelete}>Delete</Button>
          <Button variant="outline" className="flex-1" onClick={() => setDeleting(null)}>Cancel</Button>
        </div>
      </Modal>
    </div>
  );
}
