
  create table "public"."course_list" (
    "id" bigint not null,
    "name" text,
    "city" text,
    "state" text,
    "holes" bigint,
    "access" text
      );


alter table "public"."course_list" enable row level security;

alter table "public"."Courses" add column "access" text;

alter table "public"."Courses" add column "holes" integer;

CREATE UNIQUE INDEX course_list_pkey ON public.course_list USING btree (id);

alter table "public"."course_list" add constraint "course_list_pkey" PRIMARY KEY using index "course_list_pkey";

grant delete on table "public"."course_list" to "anon";

grant insert on table "public"."course_list" to "anon";

grant references on table "public"."course_list" to "anon";

grant select on table "public"."course_list" to "anon";

grant trigger on table "public"."course_list" to "anon";

grant truncate on table "public"."course_list" to "anon";

grant update on table "public"."course_list" to "anon";

grant delete on table "public"."course_list" to "authenticated";

grant insert on table "public"."course_list" to "authenticated";

grant references on table "public"."course_list" to "authenticated";

grant select on table "public"."course_list" to "authenticated";

grant trigger on table "public"."course_list" to "authenticated";

grant truncate on table "public"."course_list" to "authenticated";

grant update on table "public"."course_list" to "authenticated";

grant delete on table "public"."course_list" to "service_role";

grant insert on table "public"."course_list" to "service_role";

grant references on table "public"."course_list" to "service_role";

grant select on table "public"."course_list" to "service_role";

grant trigger on table "public"."course_list" to "service_role";

grant truncate on table "public"."course_list" to "service_role";

grant update on table "public"."course_list" to "service_role";


  create policy "Enable read access for all users"
  on "public"."Courses"
  as permissive
  for select
  to public
using (true);



  create policy "Enable read access for all users"
  on "public"."course_list"
  as permissive
  for select
  to public
using (true);



