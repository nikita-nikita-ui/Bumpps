import Modal from "./ui/Modal";
import Badge from "./ui/Badge";
import Button from "./ui/Button";
import {
  HiOutlineMail,
  HiOutlineLocationMarker,
  HiOutlineCalendar
} from "react-icons/hi";

export default function UserModal({ user, open, onClose }) {

  if (!user) return null;

  const images = [
    user.profilePic,
    ...(user.additionalPhotos || [])
  ].filter(Boolean);

  return (
    <Modal open={open} onClose={onClose}>

      <div className="flex items-center gap-4">
        <img
          src={user.profilePic || "/default-avatar.png"}
          alt={user.name}
          className="h-16 w-16 rounded-full object-cover"
        />
        <div>
          <h2 className="text-xl font-semibold text-white">
            {user.name}
          </h2>
          <p className="text-sm text-ink-muted">
            {user.email}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold text-gold">
          Profile Gallery ({images.length})
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-white/10 bg-white/5"
            >
              <img
                src={img}
                alt={`${user.name}-${index}`}
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/default-avatar.png";
                }}
                className="h-36 w-full object-cover transition duration-300 hover:scale-110 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mt-5">
        <Badge tone={user.isVerified ? "success" : "neutral"}>
          {user.isVerified ? "Verified" : "Unverified"}
        </Badge>
        <Badge tone="neutral">
          {user.subscription?.plan || "Free"}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 py-6 text-sm">
        <div className="flex items-center gap-2 text-ink-muted">
          <HiOutlineMail className="text-gold" />
          {user.email}
        </div>
        <div className="flex items-center gap-2 text-ink-muted">
          <HiOutlineLocationMarker className="text-gold" />
          {user.livingIn}
        </div>
        <div className="flex items-center gap-2 text-ink-muted">
          <HiOutlineCalendar className="text-gold" />
          Joined {new Date(user.createdAt).toLocaleDateString()}
        </div>
        <div className="text-ink-muted">
          Age:
          <span className="text-white ml-1">
            {user.age}
          </span>
        </div>
        <div className="text-ink-muted">
          Gender:
          <span className="text-white ml-1">
            {user.gender}
          </span>
        </div>
        <div className="text-ink-muted">
          Job:
          <span className="text-white ml-1">
            {user.jobTitle}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-white/5 pt-5">
        <Button variant="success" size="sm">
          Approve
        </Button>
        <Button variant="outline" size="sm">
          Edit Profile
        </Button>
        <Button variant="danger" size="sm">
          Suspend
        </Button>
        <Button variant="danger" size="sm">
          Delete
        </Button>
      </div>

    </Modal>
  );
}