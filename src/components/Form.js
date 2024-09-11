import axios from "axios";
import { EyeIcon } from "lucide-react";
import { EyeOffIcon } from "lucide-react";

// hooks
import { useState } from "react";
import { useForm } from "react-hook-form";

import { IMaskInput } from "react-imask";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const validarCPF = (cpf) => {
  cpf = cpf.replace(/\D/g, "");

  if (cpf.length !== 11) return false;

  if (/^(\d)\1{10}$/.test(cpf)) return false;

  const calcularDigitoVerificador = (cpfBase, fator) => {
    let soma = 0;
    for (let i = 0; i < cpfBase.length; i++) {
      soma += cpfBase[i] * fator--;
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  const cpfBase = cpf.slice(0, 9);
  const primeiroDigito = calcularDigitoVerificador(cpfBase, 10);
  const segundoDigito = calcularDigitoVerificador(cpfBase + primeiroDigito, 11);

  return cpf[9] == primeiroDigito && cpf[10] == segundoDigito;
};

const schema = z
  .object({
    name: z.string().max(255).min(3, "Campo nome necessário"),
    email: z.string().email("Campo email necessário"),
    password: z
      .string()
      .min(8, "Senha deve ter pelo menos 8 caracteres")
      .max(255),
    confirmPassword: z.string().max(255),
    phone: z
      .string()
      .min(3, { message: "Campo telefone ter ao menos 3 caracteres" })
      .max(20, { message: "Número inválido" }),
    cpf: z
      .string()
      .max(14, "O CPF deve ter no máximo 14 caracteres")
      .min(11, "O CPF deve ter pelo menos 11 caracteres")
      .refine(validarCPF, "O CPF fornecido é inválido"),
    cep: z.string().max(9),
    address: z.string().max(255),
    city: z.string().max(255),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas devem coincidir",
    path: ["confirmPassword"],
  });

export default function Form() {
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const onSubmit = async (data) => {
    try {
      const result = await postUser(data);

      if (result.success) {
        reset();
        setChecked(false);
        setMessage(result.responseMessage);
        setMessageType("success");
        console.log(data);
      } else {
        setMessage(result.responseMessage);
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Erro inesperado ao enviar o formulário.");
      setMessageType("error");
    }
  };

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassoword] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [cep, setCep] = useState("");
  const [checked, setChecked] = useState(false);

  const handleClick = () => setChecked(!checked);
  // const [endereco, setEndereco] = useState("")
  // const [cidade, setCidade] = useState("")

  const handlePhoneChange = (value) => {
    setValue("phone", value);
    trigger("phone");
    console.log(setValue);
  };

  // mudar senha
  const [changePassword, setChangePassword] = useState(true);
  const changeIcon = changePassword === true ? false : true;

  // mudar confirmar senha
  const [changeConfirmPassword, setChangeConfirmPassword] = useState(true);
  const changeConfirmIcon = changeConfirmPassword === true ? false : true;

  //   consumir api
  const BASEURL = "https://apis.codante.io/api/register-user";

  const postUser = async (data) => {
    const body = {
      name: data.name,
      email: data.email,
      password: data.password,
      password_confirmation: data.confirmPassword,
      cpf: data.cpf,
      phone: data.phone,
      zipcode: data.cep,
      address: data.address,
      city: data.city,
      terms: checked,
    };

    try {
      const response = await axios.post(`${BASEURL}/register`, body);
      console.log("usuario criado", response.data);
      return { success: true, responseMessage: "Usuário criado com sucesso." };
    } catch (error) {
      console.log(error.response ? error.response.data : error.message);
      return { success: false, responseMessage: "Erro ao criar o usuário." };
    }
  };

  const checkCEP = (e) => {
    const cep = e.target.value.replace(/\D/g, "");
    // console.log(cep);
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setValue("address", data.logradouro);
        setValue("city", data.localidade);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label htmlFor="name">Nome Completo</label>
        <input
          type="text"
          id="name"
          value={name}
          {...register("name")}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="min-h-4">
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="email">E-mail</label>
        <input
          className=""
          type="email"
          id="email"
          value={email}
          {...register("email")}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="min-h-4">
        {errors.email && (
          <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="password">Senha</label>
        <div className="relative">
          <input
            type={changePassword ? "password" : "text"}
            id="password"
            value={password}
            {...register("password")}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="absolute right-3 top-3">
            {changePassword ? (
              <EyeIcon
                size={20}
                className="text-slate-600 cursor-pointer"
                onClick={() => setChangePassword(changeIcon)}
              />
            ) : (
              <EyeOffIcon
                size={20}
                className="text-slate-600 cursor-pointer"
                onClick={() => setChangePassword(changeIcon)}
              />
            )}
          </span>
        </div>
        <div className="min-h-4">
          {errors.password && (
            <p className="text-xs text-red-400 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="confirm-password">Confirmar Senha</label>
        <div className="relative">
          <input
            type={changeConfirmPassword ? "password" : "text"}
            id="confirm-password"
            value={confirmPassword}
            {...register("confirmPassword")}
            onChange={(e) => setConfirmPassoword(e.target.value)}
          />
          <span className="absolute right-3 top-3">
            {changeConfirmPassword ? (
              <EyeIcon
                size={20}
                className="text-slate-600 cursor-pointer"
                onClick={() => setChangeConfirmPassword(changeConfirmIcon)}
              />
            ) : (
              <EyeOffIcon
                size={20}
                className="text-slate-600 cursor-pointer"
                onClick={() => setChangeConfirmPassword(changeConfirmIcon)}
              />
            )}
          </span>
        </div>
        <div className="min-h-4">
          {errors.confirmPassword && (
            <p className="text-xs text-red-400 mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="phone">Telefone Celular</label>
        <IMaskInput
          mask="(00) 00000-0000"
          type="text"
          id="phone"
          value={phone}
          {...register("phone", { required: "Campo telefone é obrigatório" })}
          onAccept={(value) => setValue("phone", value)}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div className="min-h-4">
        {errors.phone && (
          <p className="text-xs text-red-400 mt-1">{errors.phone.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="cpf">CPF</label>
        <IMaskInput
          mask="000.000.000-00"
          type="text"
          id="cpf"
          value={cpf}
          {...register("cpf", { required: "Campo cpf é obrigatório" })}
          onAccept={(value) => setValue("cpf", value)}
          onChange={(e) => setCpf(e.target.value)}
        />
      </div>
      <div className="min-h-4">
        {errors.cpf && (
          <p className="text-xs text-red-400 mt-1">{errors.cpf.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="cep">CEP</label>
        <IMaskInput
          mask="00000-000"
          type="text"
          id="cep"
          value={cep}
          {...register("cep", { required: "Campo CEP é obrigatório" })}
          onAccept={(value) => setValue("cep", value)}
          onChange={(e) => setCep(e.target.value)}
          onBlur={checkCEP}
        />
      </div>
      <div className="min-h-4">
        {errors.cep && (
          <p className="text-xs text-red-400 mt-1">{errors.cpcepf.message}</p>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="address">Endereço</label>
        <input
          className="disabled:bg-slate-200"
          type="text"
          id="address"
          {...register("address")}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="city">Cidade</label>
        <input
          className="disabled:bg-slate-200"
          type="text"
          id="city"
          {...register("city")}
        />
      </div>
      <div className="mb-4">
        <input
          type="checkbox"
          id="terms"
          className="mr-2 accent-slate-500"
          onClick={handleClick}
        />
        <label
          className="text-sm  font-light text-slate-500 mb-1 inline"
          htmlFor="terms"
        >
          Aceito os{" "}
          <span className="underline hover:text-slate-900 cursor-pointer">
            termos e condições
          </span>
        </label>
      </div>

      <button
        type="submit"
        className="bg-slate-500 font-semibold text-white w-full rounded-xl p-4 mt-10 hover:bg-slate-600 transition-colors"
      >
        Enviar
      </button>
      {message && (
        <div
          className={`mt-4 ${
            messageType === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </div>
      )}
    </form>
  );
}
