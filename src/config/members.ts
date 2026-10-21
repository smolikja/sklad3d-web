/**
 * Members of SKLAD in display order — structural data only. Names and
 * nicknames are proper nouns and stay here; roles, bios, link labels and media
 * descriptions are copy in `dict.members.items[id]` (see `messages/*.json`).
 *
 * Photos and video posters live in `public/images/members/<id>/` and are
 * optimized by `next/image`. Videos are too large for the repository and stay
 * on the media host; only their URLs are listed here.
 */

/** Intrinsic pixel size of an image file, used for aspect ratio and `srcset`. */
export type ImageAsset = {
  src: string;
  width: number;
  height: number;
};

export type MemberImage = ImageAsset & {
  kind: "image";
  /** Key into `dict.members.items[member].media` for the description. */
  id: string;
};

export type MemberVideo = {
  kind: "video";
  id: string;
  src: string;
  /** A frame of the video; its size is the video's size. */
  poster: ImageAsset;
};

export type MemberMedia = MemberImage | MemberVideo;

export type MemberLink = {
  /** Key into `dict.members.items[member].links` for the label. */
  id: string;
  href: string;
};

type MemberConfig = {
  id: string;
  name: string;
  nickname?: string;
  avatar: ImageAsset;
  links: readonly MemberLink[];
  media: readonly MemberMedia[];
};

const IMAGE_ROOT = "/images/members";
const VIDEO_ROOT = "https://smolikja.team/assets/sklad-digital/members";

function avatar(member: string, width: number, height: number): ImageAsset {
  return { src: `${IMAGE_ROOT}/${member}/avatar.jpg`, width, height };
}

/** A still from `public/images/members/<member>/work/<file>`. */
function image(member: string, id: string, file: string, width: number, height: number): MemberImage {
  return { kind: "image", id, src: `${IMAGE_ROOT}/${member}/work/${file}`, width, height };
}

/**
 * A video on the media host (`<VIDEO_ROOT>/<videoPath>`) with its poster from
 * `public/images/members/<member>/posters/<id>.jpg`.
 */
function video(
  member: string,
  id: string,
  videoPath: string,
  width: number,
  height: number,
): MemberVideo {
  return {
    kind: "video",
    id,
    src: `${VIDEO_ROOT}/${videoPath}`,
    poster: { src: `${IMAGE_ROOT}/${member}/posters/${id}.jpg`, width, height },
  };
}

const memberList = [
  {
    id: "oxoo",
    name: "Lukáš Dřevjaný",
    nickname: "oxoo",
    avatar: avatar("oxoo", 1080, 1080),
    links: [
      { id: "website", href: "https://oxoo.digital/" },
      { id: "instagram", href: "https://www.instagram.com/oxooxooxoxoxxo" },
    ],
    media: [
      image("oxoo", "terraform", "terraform.jpg", 2392, 2560),
      image("oxoo", "fragment", "fragment.jpg", 2560, 1707),
      image("oxoo", "nexus", "nexus.jpg", 2560, 1708),
    ],
  },
  {
    id: "done",
    name: "Daniel Randus",
    nickname: "DONE",
    avatar: avatar("done", 1080, 1080),
    links: [
      { id: "plantaz", href: "https://danielrandus.art/#home/plantaz" },
      { id: "portfolio", href: "https://danielrandus.art/" },
    ],
    media: [
      video("done", "showreel", "done/showcase/showreel.mp4", 1920, 1080),
      video("done", "plantaz-vr-tracking", "done/showcase/Plantaz VR Tracking.mp4", 1440, 2560),
      image("done", "plantaz-card", "plantaz-card.webp", 1081, 1546),
    ],
  },
  {
    id: "nikita",
    name: "Nikita Kutimskij",
    nickname: "AMT",
    avatar: avatar("nikita", 1080, 1080),
    links: [{ id: "instagram", href: "https://www.instagram.com/amt________________/" }],
    media: [
      video("nikita", "strom", "nikita/showcase/nikita-strom.mp4", 1920, 1080),
      image("nikita", "nikita-2", "nikita-2.jpg", 1920, 1200),
      image("nikita", "nikita-4", "nikita-4.jpg", 1080, 1080),
      image("nikita", "nikita-1", "nikita-1.jpg", 834, 600),
    ],
  },
  {
    id: "slejdy",
    name: "Jan Sládečko",
    nickname: "SLEJDY",
    avatar: avatar("slejdy", 155, 153),
    links: [{ id: "instagram", href: "https://www.instagram.com/jan.sladecko/" }],
    media: [
      video("slejdy", "breathing-forest", "slejdy/showcase/slejdy_2_BreathingForest_Cycle_21_04_FIN.mp4", 960, 1440),
      video(
        "slejdy",
        "launching-robot",
        "slejdy/showcase/slejdy_6_Launching Robot _ Breakdown (After Effects and Cinema 4D) 99frames_h264.mp4",
        1920,
        1080,
      ),
      video("slejdy", "awakening", "slejdy/showcase/slejdy_1_Awakening_03.mp4", 1920, 800),
      video("slejdy", "ice-cream-chase", "slejdy/showcase/slejdy_3_IceCreamChase_23signed.mp4", 1000, 1000),
      video("slejdy", "imax", "slejdy/showcase/slejdy_4_IMAX.mp4", 1920, 1080),
      video("slejdy", "jbalvin-making-of", "slejdy/showcase/slejdy_5_JBalvin_MakingOf.mp4", 1920, 1080),
      video("slejdy", "pantheon-elastic", "slejdy/showcase/slejdy_7_PantheonElastic.mp4", 640, 360),
      video("slejdy", "silly-cubes", "slejdy/showcase/slejdy_8_SillyCubes_01.mp4", 2048, 700),
      video("slejdy", "rocket-launch", "slejdy/showcase/slejdy_9_SS_RocketLaunch_23_HOR.mp4", 1920, 1080),
    ],
  },
  {
    id: "meloon",
    name: "Matěj Meloun",
    nickname: "MELOON",
    avatar: avatar("meloon", 1024, 1024),
    links: [{ id: "instagram", href: "https://www.instagram.com/meloon.m/" }],
    media: [2, 1, 5, 7, 8, 4, 6, 3].map((n) =>
      video("meloon", `presents-${n}`, `meloon/showcase/Meloon_presents_${n}.mp4`, 1440, 1920),
    ),
  },
  {
    id: "dari",
    name: "Dari Oxid",
    nickname: "avo0xid",
    avatar: avatar("dari", 155, 153),
    links: [{ id: "instagram", href: "https://www.instagram.com/avo0xid/" }],
    media: [
      video("dari", "presents-2", "dari/showcase/Dari_presents_2.mp4", 1090, 1920),
      video("dari", "presents-3", "dari/showcase/Dari_presents_3.mp4", 1348, 1810),
      video("dari", "presents-1", "dari/showcase/Dari_presents_1.mp4", 1080, 1920),
      video("dari", "presents-4", "dari/showcase/Dari_presents_4.mp4", 1470, 1968),
      image("dari", "memory-of-the-stone", "memory-of-the-stone.jpg", 1804, 2320),
    ],
  },
  {
    id: "jakub",
    name: "Jakub Smolík",
    nickname: "smolikja",
    avatar: avatar("jakub", 1080, 1080),
    links: [
      { id: "website", href: "https://smolikja.team/" },
      { id: "github", href: "https://github.com/smolikja" },
    ],
    media: [
      image("jakub", "studanky", "studanky.jpg", 2560, 1440),
      image("jakub", "staje", "staje.jpg", 2560, 1440),
      image("jakub", "domov", "domov.jpg", 2560, 1440),
      image("jakub", "servers", "servers.jpg", 2560, 1440),
      image("jakub", "notysky", "notysky.jpg", 2560, 1440),
    ],
  },
  {
    id: "daniel-holas",
    name: "Daniel Holas",
    avatar: avatar("daniel-holas", 153, 154),
    links: [{ id: "instagram", href: "https://www.instagram.com/danholas/" }],
    media: [],
  },
] as const satisfies readonly MemberConfig[];

export type MemberId = (typeof memberList)[number]["id"];
export type Member = Omit<MemberConfig, "id"> & { id: MemberId };

export const members: readonly Member[] = memberList;

/** In-page anchor of a member's profile, used by the roster and structured data. */
export function memberAnchor(member: Pick<Member, "id">): string {
  return `member-${member.id}`;
}
