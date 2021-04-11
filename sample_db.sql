--
-- PostgreSQL database dump
--

-- Dumped from database version 12.6 (Ubuntu 12.6-0ubuntu0.20.04.1)
-- Dumped by pg_dump version 12.6 (Ubuntu 12.6-0ubuntu0.20.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: atm_accounts; Type: TABLE; Schema: public; Owner: atm
--

CREATE TABLE public.atm_accounts (
    cpf character(11),
    id_account integer NOT NULL,
    type character(1) NOT NULL,
    balance integer,
    CONSTRAINT account_type CHECK (((type = 'C'::bpchar) OR (type = 'P'::bpchar))),
    CONSTRAINT positive_balance CHECK ((balance >= 0))
);


ALTER TABLE public.atm_accounts OWNER TO atm;

--
-- Name: atm_accounts_id_account_seq; Type: SEQUENCE; Schema: public; Owner: atm
--

CREATE SEQUENCE public.atm_accounts_id_account_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.atm_accounts_id_account_seq OWNER TO atm;

--
-- Name: atm_accounts_id_account_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: atm
--

ALTER SEQUENCE public.atm_accounts_id_account_seq OWNED BY public.atm_accounts.id_account;


--
-- Name: atm_users; Type: TABLE; Schema: public; Owner: atm
--

CREATE TABLE public.atm_users (
    name character varying(50) NOT NULL,
    cpf character(11) NOT NULL,
    b_date date NOT NULL,
    CONSTRAINT cpf_exact_length CHECK ((char_length(cpf) = 11)),
    CONSTRAINT non_empty_name CHECK (((name)::text <> ''::text))
);


ALTER TABLE public.atm_users OWNER TO atm;

--
-- Name: atm_accounts id_account; Type: DEFAULT; Schema: public; Owner: atm
--

ALTER TABLE ONLY public.atm_accounts ALTER COLUMN id_account SET DEFAULT nextval('public.atm_accounts_id_account_seq'::regclass);


--
-- Data for Name: atm_accounts; Type: TABLE DATA; Schema: public; Owner: atm
--

COPY public.atm_accounts (cpf, id_account, type, balance) FROM stdin;
22255588813	1	P	160
00011122233	2	P	250
12345678900	3	C	515
00011122233	4	C	18867
\.


--
-- Data for Name: atm_users; Type: TABLE DATA; Schema: public; Owner: atm
--

COPY public.atm_users (name, cpf, b_date) FROM stdin;
Kevin Flynn	00011122233	1984-02-28
Sam Flynn	12345678900	1961-02-28
Maximus Decimus Meridius	22255588813	2000-05-19
Marcus Aurelius	11144477789	1984-02-28
\.


--
-- Name: atm_accounts_id_account_seq; Type: SEQUENCE SET; Schema: public; Owner: atm
--

SELECT pg_catalog.setval('public.atm_accounts_id_account_seq', 15, true);


--
-- Name: atm_accounts atm_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: atm
--

ALTER TABLE ONLY public.atm_accounts
    ADD CONSTRAINT atm_accounts_pkey PRIMARY KEY (id_account);


--
-- Name: atm_users atm_users_pkey; Type: CONSTRAINT; Schema: public; Owner: atm
--

ALTER TABLE ONLY public.atm_users
    ADD CONSTRAINT atm_users_pkey PRIMARY KEY (cpf);


--
-- Name: atm_accounts atm_accounts_cpf_fkey; Type: FK CONSTRAINT; Schema: public; Owner: atm
--

ALTER TABLE ONLY public.atm_accounts
    ADD CONSTRAINT atm_accounts_cpf_fkey FOREIGN KEY (cpf) REFERENCES public.atm_users(cpf) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

